import React from 'react';
import ProductCard from './ProductCard';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: {
    id: number;
    email: string;
  };
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
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
