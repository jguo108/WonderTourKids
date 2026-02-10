import React from 'react';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 h-full min-h-[50vh]">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-400 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-2 left-2 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-blue-200 animate-bounce">
          🤖
        </div>
      </div>
      <h2 className="text-2xl font-bold text-blue-600 text-center animate-pulse">{message}</h2>
      <p className="text-gray-500 mt-2 text-center">Hold on tight!</p>
    </div>
  );
};

export default LoadingScreen;
