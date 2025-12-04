import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  productCount?: number;
}

interface CategorySectionProps {
  categories?: Category[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  herbal: '/images/categories/herbal.jpg',
  skincare: '/images/categories/skincare.jpg',
  supplements: '/images/categories/supplements.jpg',
};

const FALLBACK_CATEGORIES: Category[] = [
  {
    _id: 'herbal',
    name: 'Herbal Remedies',
    description: 'Roots, leaves, and blends crafted for daily rituals.',
    image: '/images/categories/herbal.jpg',
    productCount: 12,
  },
  {
    _id: 'skincare',
    name: 'Skincare Rituals',
    description: 'Plant-powered oils, serums, and butters.',
    image: '/images/categories/skincare.jpg',
    productCount: 9,
  },
  {
    _id: 'supplements',
    name: 'Supplements',
    description: 'Boost immunity with moringa, baobab, and more.',
    image: '/images/categories/supplements.jpg',
    productCount: 7,
  },
];

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  // Use fallback categories if none provided, otherwise merge with local images
  const items = categories && categories.length 
    ? categories.map(cat => ({
        ...cat,
        image: cat.image || CATEGORY_IMAGES[cat._id || ''] || '/images/categories/herbal.jpg',
      }))
    : FALLBACK_CATEGORIES;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
            Explore
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Shop by Category</h2>
          <p className="mt-3 text-gray-600">
            Curated collections crafted for DeeDees Health & Wellness customers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((category) => (
            <Link
              key={category._id || category.name}
              href={`/categories/${category.slug || category._id || ''}`}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image || '/images/categories/placeholder.jpg'}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm text-white/80 line-clamp-2">{category.description}</p>
                {typeof category.productCount === 'number' && (
                  <p className="mt-3 text-sm font-semibold text-primary-100">
                    {category.productCount} products
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

