import React from 'react';
import '../styles/Navbar.css'; // Import CSS file for styling
import logo from '/logo_Ruvee.png'; // Import logo image
import profile from '/profile.png'; // Import logo image
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate
// import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const cartCount = 0;

    const  backWelcomePage = () => {
      navigate('/');  
    };
    
  return (
    <>
    <nav className="navbar ">
        <img src={logo} alt="" className='w-20 logo' onClick={backWelcomePage}/>
        <div>
            <ul className="nav-links items-center">
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
                <li className="cart-icon ">
                    <a href="#cart" className='flex items-center'>
                        <i className="fa-solid fa-cart-shopping"></i>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </a>
                </li>
                <img src={profile} alt=""  className='w-10 profile'/>
            </ul> 
        </div>
    </nav>
    <div className='search-container flex justify-center items-center'>
        <i className="fa-solid fa-magnifying-glass ml-4"></i>
        <input type="text" className='searchItem' placeholder='search your attitude'/>
    </div>
    </>
    
  );
};

export default Navbar;
