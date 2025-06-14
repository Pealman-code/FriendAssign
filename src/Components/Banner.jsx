import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Banner = () => {
  const backgroundImages = [
    'https://i.postimg.cc/fW0zkGd9/3c056902329c20dbf6d7b6397fa9b8bb.jpg',
    'https://i.postimg.cc/hGNM2QtM/bc0ab5dc3c52b40ddfa075388375703c.jpg', 
    'https://i.postimg.cc/kXrqqQKZ/5992cf620a9fea4eae67708d147c50ce.jpg', 
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation
      className="min-h-screen min-w-full"
    >
      {backgroundImages.map((image, index) => (
        <SwiperSlide key={index}>
          <div
            className="hero min-h-screen"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
              <div>
                <h1 className="mb-5 text-5xl font-bold">
                  <span className="text-blue-600">HobbyHub </span> Group Organizer
                </h1>
                <p className="mb-4 text-lg font-bold">
                The Most Complete Social Network is Here!
                </p>
                <div className="pl-36 mb-2">
                  <p className="flex items-center space-x-2 text-white mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>100% Satisfaction Guarantee</span>
                  </p>
                  <p className="flex items-center space-x-2 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Award-Winning Group Community                    </span>
                  </p>
                </div>
                <button className="btn btn-primary mt-4">Subscribe Now</button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;