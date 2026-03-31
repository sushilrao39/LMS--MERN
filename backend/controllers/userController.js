import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js"
import Stripe from "stripe";

// Get User Data
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();    // Clerk userId

        // Find MongoDB user using clerkId (NOT _id)
       // const user = await User.findOne({ clerkId: userId });
       const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'User Not Found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Users Enrolled Courses With Lecture Links 
export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth();  // Clerk userId

        // 🔥 Find MongoDB user using Clerk ID
      //  const userData = await User.findOne({ clerkId: userId })
      const userData = await User.findById(userId)
                                   .populate('enrolledCourses');

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found in database"
            });
        }

        res.json({
            success: true,
            enrolledCourses: userData.enrolledCourses
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Purchase Course 

export const purchaseCourse = async (req, res)=>{
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;

        const{ userId }= req.auth(); //

        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found '})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount* courseData.coursePrice /100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        // stripe Gateway Initialize 
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        // creating line items to for Stripe 
        const line_items = [{
            price_data:{
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                PurchaseId: newPurchase._id.toString()
            }
        })

        res.json({success: true, session_url: session.url})



    } catch (error) {
        res.json({ success: false, message:error.message});

    }
}
