import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const styles = `
  .animate-text {
    opacity: 0;
    transform: translateX(-50px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }

  .swiper-slide-active .animate-text {
    opacity: 1;
    transform: translateX(0);
  }

  .animate-text-delay-1 {
    transition-delay: 0.2s;
  }

  .animate-text-delay-2 {
    transition-delay: 0.4s;
  }

  .animate-text-delay-3 {
    transition-delay: 0.6s;
  }

  .animate-text-delay-4 {
    transition-delay: 0.8s;
  }
`;

const Banner = () => {
  const backgroundImages = [
    'https://i.postimg.cc/8z0M3rWh/2da25831d964b7709792167ff70125f6.jpg',
    'https://i.postimg.cc/05nfnjtC/ca0d449facc7d06300497c212a147174.jpg',
    'https://i.postimg.cc/T39nc42H/b85aa0566b1aaf123c3b7b000c2e4cfc.jpg',
  ];

  const styleRef = useRef(false);

  useEffect(() => {
    if (!styleRef.current) {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      styleRef.current = true;
    }
  }, []);

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
                <h1 className="mb-5 text-5xl font-bold animate-text">
                  <span className="text-blue-600">Study Together.</span> Learn Better.
                </h1>
                <p className="mb-4 text-lg font-bold animate-text animate-text-delay-1">
                  Collaborate with friends, share assignments, and grow together <br /> in an engaging online study environment.
                </p>
                <div className="pl-46 mb-2">
                  <p className="flex items-center space-x-2 text-white mb-2 animate-text animate-text-delay-2">
                    <span>✅ Create & Join Study Groups</span>
                  </p>
                  <p className="flex items-center space-x-2 text-white animate-text animate-text-delay-3">
                    <span>✅ Submit and Grade Assignments</span>
                  </p>
                </div>
                <button className="btn btn-primary -ml-6 mt-4 animate-text animate-text-delay-4">
                  👉 Create First Assignment
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;