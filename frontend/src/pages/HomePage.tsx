import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { useLocation } from 'react-router-dom';

const mockProducts = [
  { id: 1, name: 'Intel Core i9-13900K', description: '24-core, 32-thread processor', price: 589, imageUrl: 'https://picsum.photos/seed/1/300/200', seller: { id: 1, email: 'seller1@example.com' } },
  { id: 2, name: 'AMD Ryzen 9 7950X', description: '16-core, 32-thread processor', price: 549, imageUrl: 'https://picsum.photos/seed/2/300/200', seller: { id: 1, email: 'seller1@example.com' } },
  { id: 3, name: 'NVIDIA GeForce RTX 4090', description: '24GB GDDR6X', price: 1599, imageUrl: 'https://picsum.photos/seed/3/300/200', seller: { id: 2, email: 'seller2@example.com' } },
  { id: 4, name: 'AMD Radeon RX 7900 XTX', description: '24GB GDDR6', price: 999, imageUrl: 'https://picsum.photos/seed/4/300/200', seller: { id: 2, email: 'seller2@example.com' } },
  { id: 5, name: 'Corsair Vengeance 32GB DDR5', description: '5600MHz CL36', price: 114, imageUrl: 'https://picsum.photos/seed/5/300/200', seller: { id: 1, email: 'seller1@example.com' } },
  { id: 6, name: 'G.Skill Trident Z5 32GB DDR5', description: '6000MHz CL30', price: 129, imageUrl: 'https://picsum.photos/seed/6/300/200', seller: { id: 2, email: 'seller2@example.com' } },
  { id: 7, name: 'Samsung 980 Pro 2TB NVMe SSD', description: 'PCIe 4.0', price: 129, imageUrl: 'https://picsum.photos/seed/7/300/200', seller: { id: 1, email: 'seller1@example.com' } },
  { id: 8, name: 'WD Black SN850X 2TB NVMe SSD', description: 'PCIe 4.0', price: 119, imageUrl: 'https://picsum.photos/seed/8/300/200', seller: { id: 2, email: 'seller2@example.com' } },
  { id: 9, name: 'ASUS ROG Strix Z790-E', description: 'LGA 1700 Motherboard', price: 499, imageUrl: 'https://picsum.photos/seed/9/300/200', seller: { id: 1, email: 'seller1@example.com' } },
  { id: 10, name: 'MSI MAG B650 Tomahawk', description: 'AM5 Motherboard', price: 219, imageUrl: 'https://picsum.photos/seed/10/300/200', seller: { id: 2, email: 'seller2@example.com' } },
  { id: 11, name: 'Corsair RM850x', description: '850W 80+ Gold PSU', price: 149, imageUrl: 'https://picsum.photos/seed/11/300/200', seller: { id: 1, email: 'seller1@example.com' } },
  { id: 12, name: 'Seasonic FOCUS Plus Gold 750W', description: '750W 80+ Gold PSU', price: 119, imageUrl: 'https://picsum.photos/seed/12/300/200', seller: { id: 2, email: 'seller2@example.com' } },
];

const HomePage: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('payment') === 'success') {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, [location.search]);

  return (
    <div>
      {showSuccessMessage && (
        <div className="bg-green-500 text-white p-4 rounded mb-4">
          Payment successful! Your order has been placed.
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8">Welcome to the PC Component Store!</h1>
      <ProductGrid products={products} />
    </div>
  );
};

export default HomePage;
