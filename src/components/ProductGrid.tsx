import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'NVIDIA GeForce RTX 4090',
    price: 1599.99,
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    name: 'AMD Ryzen 9 7950X',
    price: 699.99,
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 3,
    name: 'Corsair Vengeance 32GB DDR5',
    price: 149.99,
    image: 'https://via.placeholder.com/300',
  },
    {
    id: 4,
    name: 'Samsung 980 Pro 2TB NVMe SSD',
    price: 169.99,
    image: 'https://via.placeholder.com/300',
  },
];

const ProductGrid: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
