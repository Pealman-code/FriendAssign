import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg font-semibold animate-pulse-text">Please wait a second</p>
    </div>
  );
};

export default LoadingSpinner;