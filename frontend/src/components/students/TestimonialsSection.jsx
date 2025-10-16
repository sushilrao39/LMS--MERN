import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="pb-14 px-6 md:px-16 lg:px-28">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Testimonials
      </h2>

      <p className="text-sm md:text-base text-gray-500 mt-3 text-center">
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br className="hidden md:block" />
        platform has made a difference in their lives.
      </p>

      {/* ✅ Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-300 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] overflow-hidden transition-transform hover:scale-[1.02]"
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-100">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>

            {/* Rating + Feedback */}
            <div className="p-5 pb-7">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-500 leading-relaxed">
                {testimonial.feedback}
              </p>
            </div>

            <a
              href="#"
              className="text-blue-500 underline px-5 hover:text-blue-600"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
