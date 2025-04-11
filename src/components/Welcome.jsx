import React from 'react';
import Logo_Ruvee from '/logo_Ruvee.png';  
import { useNavigate } from 'react-router-dom'; 

const Welcome = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/home');  
  };

  return (
    <div className='welcome-container flex justify-center items-center h-screen bg-gray-200'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-5'>Welcome to  <img src={Logo_Ruvee} ></img></h1>
        <button 
          onClick={handleButtonClick} 
          className='px-12 py-4 text-white rounded-full  bg-[#ae2019] hover:bg-[#9b1c1c] transition duration-300'>
            SHOPPING NOW
        </button>
      </div>
    </div>
  );
};

export default Welcome;
