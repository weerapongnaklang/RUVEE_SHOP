// src/Route.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';  // หน้า Welcome
import Home from './components/Home';

const RouteComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />   {/* เส้นทางหน้าแรก */}
      <Route path="/home" element={<Home />} />  {/* เส้นทางไปหน้าหลัก */}
    </Routes>
  );
};

export default RouteComponent;
