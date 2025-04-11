// src/components/Home.jsx
import React from 'react';
import Navbar from './์Navbar';
import productData  from "../Data/product.jsx";
import CardItem from './CardItem';
import { useEffect, useState } from 'react'; // นำเข้า useEffect และ useState จาก React
const Home = () => {
  const [product, setProduct] = useState([]); // สร้าง state สำหรับ product
  console.log("Product in Home:", product); // ลองดูว่า array ซ้ำไหม
  useEffect(() => {
    setProduct(productData);
  }, []); // <-- มี [] เพื่อให้ทำแค่ครั้งแรก
  
  return (
    <div>
      <Navbar /> 
      <div className='flex flex-wrap justify-center items-center'>
        {product.map((item) => (
          <CardItem key={item.id} item={item} />
        ))}
      </div>
    
    </div>
  );
};

export default Home;
