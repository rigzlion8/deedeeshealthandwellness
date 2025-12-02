import React from 'react';
import ProductCard, { type ProductType } from './ProductCard';

interface ProductGridProps {
  products?: ProductType[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
        Products will appear here as soon as you add them in DeeDees Health & Wellness
        dashboard.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

