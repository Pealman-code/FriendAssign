import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/MyProvider';
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

  .animate-text-delay-1 { transition-delay: 0.2s; }
  .animate-text-delay-2 { transition-delay: 0.4s; }
  .animate-text-delay-3 { transition-delay: 0.6s; }
  .animate-text-delay-4 { transition-delay: 0.8s; }
`;

const Banner = () => {
  const backgroundImages = [
    'https://i.postimg.cc/8z0M3rWh/2da25831d964b7709792167ff70125f6.jpg',
    'https://i.postimg.cc/05nfnjtC/ca0d449facc7d06300497c212a147174.jpg',
    'https://i.postimg.cc/T39nc42H/b85aa0566b1aaf123c3b7b000c2e4cfc.jpg',
  ];

  const styleRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!styleRef.current) {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      styleRef.current = true;
    }
  }, []);

  const handleCreateClick = () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to create an assignment.',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/auth/login');
        }
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/create-assignments');
    }, 1500);
  };

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                <button
                  className="btn btn-primary -ml-6 mt-4 animate-text animate-text-delay-4"
                  onClick={handleCreateClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </span>
                  ) : (
                    '👉 Create First Assignment'
                  )}
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