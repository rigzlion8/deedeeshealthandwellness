import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import ProductGrid from '../../components/Products/ProductGrid';
import type { ProductType } from '../../components/Products/ProductCard';
import { fetchProducts } from '../../lib/api';

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  image: string;
}

const CATEGORY_DATA: Record<string, CategoryInfo> = {
  herbal: {
    id: 'herbal',
    name: 'Herbal Remedies',
    description: 'Roots, leaves, and blends crafted for daily wellness rituals. Discover traditional Kenyan botanicals that support your health journey.',
    image: '/images/categories/herbal.jpg',
  },
  skincare: {
    id: 'skincare',
    name: 'Skincare Rituals',
    description: 'Plant-powered oils, serums, and butters for radiant, healthy skin. Nourish your skin with nature\'s finest ingredients.',
    image: '/images/categories/skincare.jpg',
  },
  supplements: {
    id: 'supplements',
    name: 'Supplements',
    description: 'Boost immunity and vitality with moringa, baobab, and other powerful Kenyan superfoods in convenient supplement form.',
    image: '/images/categories/supplements.jpg',
  },
  teas: {
    id: 'teas',
    name: 'Herbal Teas',
    description: 'Soothing and revitalizing herbal tea blends made from carefully selected botanicals for every mood and moment.',
    image: '/images/categories/herbal.jpg',
  },
  oils: {
    id: 'oils',
    name: 'Essential Oils',
    description: 'Pure, therapeutic-grade essential oils for aromatherapy, massage, and natural wellness practices.',
    image: '/images/categories/skincare.jpg',
  },
};

interface CategoryPageProps {
  slug: string;
  category: CategoryInfo;
  products: ProductType[];
}

const CategoryPage: NextPage<CategoryPageProps> = ({ slug, category, products }) => {
  return (
    <>
      <Head>
        <title>{category.name} - DeeDees Health &amp; Wellness</title>
        <meta name="description" content={category.description} />
      </Head>

      {/* Category Hero */}
      <section className="relative h-64 md:h-80">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <nav className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-white/70">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/products" className="hover:text-white">
                    Products
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">{category.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
            <p className="mt-2 max-w-2xl text-white/80">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-slate-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
            <Link
              href="/products"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              ← View All Products
            </Link>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-slate-900">
                No products yet in {category.name}
              </h3>
              <p className="mt-2 text-slate-500">
                We&apos;re curating the finest products for this category. Check back soon!
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore Other Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(CATEGORY_DATA)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/categories/${key}`}
                  className="group relative overflow-hidden rounded-2xl h-40"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
  const slug = context.params?.slug as string;
  
  // Get category info (fallback to generic if not found)
  const category = CATEGORY_DATA[slug] || {
    id: slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Browse our ${slug} collection at DeeDees Health & Wellness.`,
    image: '/images/categories/herbal.jpg',
  };

  try {
    // Fetch products filtered by category
    const products = await fetchProducts({ category: slug, limit: 50 });
    
    return {
      props: {
        slug,
        category,
        products,
      },
    };
  } catch (error) {
    console.error('Failed to fetch products for category:', error);
    return {
      props: {
        slug,
        category,
        products: [],
      },
    };
  }
};

export default CategoryPage;

