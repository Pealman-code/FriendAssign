import React from "react";
import { Fade } from "react-awesome-reveal";

const Benifit = () => {
  const benefits = [
    "100% Satisfaction Guarantee",
    "Connect with like-minded people.",
    "Share ideas and experiences.",
    "Join events and activities.",
    "Stay Up-To-Date Through Groups",
    "Award-Winning Group Community",
    "Get support from your community.",
  ];

  return (
    <section className="flex flex-col md:flex-row items-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-30 bg-gray-100 gap-8">
      <div className="md:w-1/2 mb-6 md:mb-0 md:mr-4 lg:mr-8">
        <img
          src="https://i.postimg.cc/0NKjPkhH/0f770ed96ae280e123c40e90be24a604.jpg"
          alt="Crate with vegetables"
          className="rounded-lg shadow-lg w-full sm:w-3/4 md:w-full h-auto object-cover mx-auto"
        />
      </div>

      <div className="md:w-1/2">
        <Fade cascade damping={0.2} triggerOnce>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            The Group Member Benefits
          </h2>

          <p className="text-gray-600 mb-6 text-sm sm:text-base lg:text-lg">
            The Group Member Benefits include opportunities to connect, learn,
            and grow with like-minded people. Members enjoy shared activities,
            support, and a strong sense of community.
          </p>

          <ul className="space-y-2 mb-6">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-center text-gray-700 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {benefit}
              </li>
            ))}
          </ul>

          <button className="btn btn-outline btn-info font-bold py-2 px-4 sm:py-3 sm:px-6">
            JOIN US
          </button>
        </Fade>
      </div>
    </section>
  );
};

export default Benifit;
