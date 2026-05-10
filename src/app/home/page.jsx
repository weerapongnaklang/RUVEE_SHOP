'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import CardItem from '../../components/CardItem';
import productData from '../../data/product';

export default function HomePage() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    setProduct(productData);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-wrap justify-center items-center">
        {product.map((item) => (
          <CardItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
