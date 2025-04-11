// src/index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';  // ใช้ App.jsx ที่มี Routing อยู่แล้ว
import './index.css';  // Import css file ที่มี Tailwind


createRoot(document.getElementById('root')).render(
    <App />  
);
