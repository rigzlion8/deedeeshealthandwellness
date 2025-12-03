import React from 'react';
import { GetServerSideProps } from 'next';
import HeroBanner from '../components/Home/HeroBanner';
import ProductGrid from '../components/Products/ProductGrid';
import CategorySection from '../components/Home/CategorySection';
import CheckoutButton from '../components/Cart/CheckoutButton';
import { fetchProducts, fetchCategories, fetchHeroSettings, type HeroSettings } from '../lib/api';

interface HomeProps {
  featuredProducts: any[];
  categories: any[];
  newArrivals: any[];
  hero: HeroSettings;
}

const Home: React.FC<HomeProps> = ({ featuredProducts, categories, newArrivals, hero }) => {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner 
        title={hero.title}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl}
        ctaText={hero.ctaText}
        ctaLink={hero.ctaLink}
        stats={hero.stats}
      />

      {/* Categories */}
      <CategorySection categories={categories} />

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-primary-600 text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-2">100% Natural</h3>
              <p className="text-gray-600">Pure herbal ingredients from Kenya</p>
            </div>
            <div className="text-center">
              <div className="text-primary-600 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">On orders above KSh 5,000</p>
            </div>
            <div className="text-center">
              <div className="text-primary-600 text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
              <p className="text-gray-600">Eco-friendly packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Ready to checkout?</h3>
          <p className="mt-3 text-gray-600">
            Continue with Google to complete your purchase securely.
          </p>
          <div className="mt-6 flex justify-center">
            <CheckoutButton />
          </div>
        </div>
      </section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const [products, categories, hero] = await Promise.all([
    fetchProducts({ featured: true, limit: 8 }),
    fetchCategories(),
    fetchHeroSettings(),
  ]);

  const newArrivals = await fetchProducts({
    sort: '-createdAt',
    limit: 8,
  });

  return {
    props: {
      featuredProducts: products,
      categories,
      newArrivals,
      hero,
    },
  };
};

export default Home;