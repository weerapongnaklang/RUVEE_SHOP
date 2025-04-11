// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // นำเข้า React Router
import Welcome from './components/Welcome'; 
import Home from './components/Home';       

function App() {
  return (
    <Router>  
      <Routes> 
        <Route path="/" element={<Welcome />} />  
        <Route path="/home" element={<Home />} /> 
      </Routes>
    </Router>
  );
}

export default App;
