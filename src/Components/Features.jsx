import React from 'react';
import Marquee from 'react-fast-marquee';
import { Typewriter } from 'react-simple-typewriter';

const steps = [
  {
    id: 1,
    title: 'Choose Your Plan',
    description:
      "It helps people connect with others who share similar passions, whether it's painting, coding, gardening, or sports. By choosing a group, users can participate in discussions, events, and activities that match their preferences. This makes it easier to build a community, share knowledge, and stay engaged with what they love.",
    imageUrl: 'https://i.postimg.cc/1t6fdv1K/d8fc99427c300f4ebb3899eacec8c3fe.jpg',
  },
  {
    id: 2,
    title: 'Get Your Favorite Group',
    description:
      'a feature that helps users quickly find and join groups they are most interested in. Whether you love music, photography, reading, or coding, this option allows you to explore and connect with like-minded people. It makes the experience more personal and enjoyable by suggesting groups that match your hobbies and preferences.',
    imageUrl: 'https://i.postimg.cc/PqBrNbTW/fe0fb0db0df9755b58118d7f7b064243.jpg',
  },
  {
    id: 3,
    title: 'Join Your Community',
    description:
      'a feature designed to bring people together based on shared interests and goals. It allows users to become part of a supportive group where they can exchange ideas, take part in events, and grow together. Whether it is a local hobby club, a study group, or a creative team, joining a community helps users stay connected, feel valued.',
    imageUrl: 'https://i.postimg.cc/VkgCSVVj/09e5217b239e3ddcb202de80f4699465.jpg',
  },
];

const Features = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-4 text-gray-800">
          <Typewriter
            words={["Here's How It Works", 'Only 3 Simple Steps', 'Get Started Now!']}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h2>
        <p className="text-center font-semibold mb-6 sm:mb-8 lg:mb-10 text-base sm:text-lg lg:text-xl">
          New Group Released Daily
        </p>

        <Marquee speed={50} pauseOnHover gradient={false}>
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center mx-4 sm:mx-6 lg:mx-10 w-64 sm:w-72 lg:w-80"
            >
              <div className="mb-4">
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="h-40 sm:h-44 lg:h-48 w-auto object-contain rounded-xl"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-700">
                {step.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Features;
