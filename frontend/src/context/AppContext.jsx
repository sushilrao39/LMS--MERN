
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios, { Axios } from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL


  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const {getToken} = useAuth()
  const {user} = useUser()

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userData, setUserData] = useState(null)


  // ✅ Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/course/all');

      if(data.success){
        setAllCourses(data.courses)
      }else{
        toast.error(data.messge)
      }
    } catch (error){
      toast.error(error.message)

    }
  };

  // Fetch UserData 

  const fetchUserData = async ()=>{

    if(user.publicMetadata.role === 'educator'){
      setIsEducator(true)
    }

    try {
      const token = await getToken();

      const {data} = await axios.get(backendUrl + '/api/user/data', {headers:
         {Authorization: `Bearer ${token}`}})

         if(data.success){
          setUserData(data.user)
         }else{
          toast.error(data.message)
         }
    } catch (error) {
      toast.error(error.message)
    }
  }



  // ✅ Function to calculate average rating of a course
  const calculateRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    return Math.floor( totalRating / course.courseRatings.length);
  };

  // ✅ Function to calculate total time of a single chapter
  const calculateChapterTime = (chapter) => {
    if (!chapter || !chapter.chapterContent) return "0 min";

    let totalMinutes = 0;
    chapter.chapterContent.forEach((lecture) => {
      totalMinutes += lecture.lectureDuration || 0;
    });

    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Function to calculate total course duration
  const calculateCourseDuration = (course) => {
    if (!course || !course.courseContent) return "0 min";

    let totalMinutes = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        totalMinutes += lecture.lectureDuration || 0;
      });
    });

    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Function to count total lectures in the course
  const calculateNoOfLectures = (course) => {
    if (!course || !course.courseContent) return 0;

    return course.courseContent.reduce((total, chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        return total + chapter.chapterContent.length;
      }
      return total;
    }, 0);
  };

  // fetch User Enrolled Courses 
  const fetchUserEnrolledCourses = async ()=>{
    try{
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {headers: { Authorization: `Bearer ${token}`}})

      if(data.success){
        setEnrolledCourses(data.enrolledCourses.reverse())
      } else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
    
  }


  // ✅ Fetch courses on mount
  useEffect(() => {
    fetchAllCourses();
  }, []);

  
  useEffect(()=>{
    if(user){
      fetchUserData()
      fetchUserEnrolledCourses()
    }
  },[user])

  const value = {
    currency,
    navigate,
    allCourses,
    isEducator,
    setIsEducator,
    calculateRating,
    calculateChapterTime, // ✅ fixed name
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};



