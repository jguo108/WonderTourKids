import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 p-4 shadow-lg rounded-b-3xl border-b-4 border-blue-700 sticky top-0 z-50">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-4xl">🌍</span>
        <h1 className="text-3xl font-extrabold text-white tracking-wider drop-shadow-md">
          Wonder<span className="text-yellow-300">Tour</span>
        </h1>
      </div>
      <p className="text-center text-blue-100 text-sm font-bold mt-1">
        For Kids! 🚀
      </p>
    </header>
  );
};

export default Header;
