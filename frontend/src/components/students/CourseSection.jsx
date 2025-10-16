import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-12 px-4 sm:px-8 md:px-20 lg:px-40 text-center md:text-left">
      {/* Heading Section */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
        Learn from the best
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mt-3">
        Discover our top-rated courses across various categories. From coding and design to
        <br className="hidden sm:block" />
        business and wellness, our courses are crafted to deliver results.
      </p>

      {/* Courses Grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-6 
          mt-10 
          md:mt-16
        "
      >
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {/* Button */}
      <div className="mt-8 md:mt-12">
        <Link
          to={"/course-list"}
          onClick={() => scrollTo(0, 0)}
          className="inline-block text-gray-600 border border-gray-400 px-8 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Show all courses
        </Link>
      </div>
    </div>
  );
};

export default CourseSection;
