import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";



// ✅ Update Role to Educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ fixed

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({
      success: true,
      message: "Role updated to 'educator'. You can now publish courses!",
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const { userId: educatorId } = req.auth();   // ✅ FIXED

    if (!educatorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    // Save course FIRST
    const newCourse = await Course.create(parsedCourseData);

    // Upload image
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    // Save updated course
    await newCourse.save();

    res.json({ success: true, message: "Course Added" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const courses = await Course.find({ educator: userId });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get  Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId: educator } = req.auth;
    const courses = await Course.find({ educator });
    const totalCourse = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsData, totalCourse },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Enrolled Students Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId: educator } = req.auth;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
