import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import type { ProductType } from '../../components/Products/ProductCard';
import { fetchProduct } from '../../lib/api';
import { useCart } from '../../context/CartContext';

interface ProductDetailPageProps {
  product: ProductType;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.images?.length
    ? product.images.map((img) => (typeof img === 'string' ? img : img.url))
    : ['/placeholder-product.jpg'];

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice || product.price;

  // Get size display if available
  const sizeDisplay = product.sizeValue && product.sizeUnit
    ? `${product.sizeValue}${product.sizeUnit}`
    : null;

  return (
    <>
      <Head>
        <title>{product.name} - DeeDees Health &amp; Wellness</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/products" className="hover:text-primary-600">
                  Products
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/categories/${product.category}`}
                  className="hover:text-primary-600 capitalize"
                >
                  {product.category}
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-900 font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                    -{discountPercentage}%
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="absolute top-4 right-4 rounded-full bg-primary-500 px-3 py-1 text-sm font-semibold text-white">
                    New
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        selectedImage === index
                          ? 'border-primary-500'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                  {product.category}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                  {product.name}
                </h1>
                {sizeDisplay && (
                  <p className="mt-1 text-lg text-slate-500">{sizeDisplay}</p>
                )}
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${
                          star <= product.rating
                            ? 'text-yellow-400'
                            : 'text-slate-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900">
                  KSh {displayPrice.toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-slate-400 line-through">
                    KSh {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">{product.description}</p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-3 w-3 rounded-full ${
                    product.inStock ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => {
                    if (!product.inStock) return;
                    setIsAdding(true);
                    addItem(product, quantity);
                    setTimeout(() => setIsAdding(false), 600);
                  }}
                  className="flex-1 rounded-full bg-primary-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {product.inStock ? (isAdding ? 'Adding...' : 'Add to Cart') : 'Out of Stock'}
                </button>
              </div>

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="rounded-2xl bg-primary-50 p-6">
                  <h3 className="font-semibold text-slate-900">Key Benefits</h3>
                  <ul className="mt-3 space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-primary-500">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900">Ingredients</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Description & Usage */}
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {product.detailedDescription && (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">About This Product</h2>
                <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.detailedDescription}
                </p>
              </div>
            )}

            {product.usageInstructions && (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">How to Use</h2>
                <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.usageInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Back to Products */}
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block rounded-full border-2 border-primary-600 px-8 py-3 font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              ← Back to All Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async (
  context
) => {
  const id = context.params?.id as string;

  try {
    const product = await fetchProduct(id);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return {
      notFound: true,
    };
  }
};

export default ProductDetailPage;

