import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from './ProductGrid';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 shadow-lg flex flex-col">
      <Link to={`/product/${product.id}`} className="flex-grow">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
      </Link>
      <button
        onClick={() => addToCart(product, 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-auto"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
