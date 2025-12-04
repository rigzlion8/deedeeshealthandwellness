import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type ProductType = {
  _id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  price: number;
  discountPrice?: number;
  images: (string | { url: string })[];
  category: string;
  inStock: boolean;
  rating: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  sizeValue?: number;
  sizeUnit?: string;
  stockQuantity?: number;
  minStockLevel?: number;
  tags?: string[];
  benefits?: string[];
  ingredients?: string[];
  usageInstructions?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
};

interface ProductCardProps {
  product: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200">
          <Image
            src={
              typeof product.images[0] === 'string'
                ? product.images[0]
                : product.images[0]?.url || '/placeholder-product.jpg'
            }
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}%
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${product.discountPrice ? 'text-red-600' : 'text-gray-900'}`}>
                KSh {product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  KSh {product.price}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-gray-600">{product.rating}</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;