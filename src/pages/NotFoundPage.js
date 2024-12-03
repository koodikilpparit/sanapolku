import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-sp-white text-4xl md:text-6xl lg:text-7xl font-bold py-2 md:py-4">
        Hups, eksyit polulta!
      </h1>
      <button
        className="btn-sp-primary w-full sm:w-1/2 bg-sp-light-green cursor-pointer"
        onClick={() => navigate('/')}
      >
        Takaisin etusivulle
      </button>
    </div>
  );
};

export default NotFound;
