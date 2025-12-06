import React from 'react';
import { GetServerSideProps } from 'next';
import HeroBanner from '../components/Home/HeroBanner';
import ProductGrid from '../components/Products/ProductGrid';
import CategorySection from '../components/Home/CategorySection';
import CheckoutButton from '../components/Cart/CheckoutButton';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts, fetchCategories, fetchHeroSettings, type HeroSettings } from '../lib/api';

interface HomeProps {
  featuredProducts: any[];
  categories: any[];
  newArrivals: any[];
  hero: HeroSettings;
}

const BLOG_POSTS = [
  {
    slug: 'blue-lotus-serenity',
    title: 'Blue Lotus: The Ritual of Serenity',
    category: 'Blue Lotus',
    image: '/images/blog/blue-lotus.jpg',
    excerpt:
      'Discover how the sacred Blue Lotus flower infuses calm into modern herbal teas and mindful breathwork.',
  },
  {
    slug: 'clove-warming-elixir',
    title: 'Cloves & Wild Honey Warming Elixir',
    category: 'Cloves',
    image: '/images/blog/cloves.jpg',
    excerpt:
      'A spiced infusion for colder evenings—learn the benefits of eugenol-rich clove buds in circulation and immunity.',
  },
  {
    slug: 'moringa-dawn-tonic',
    title: 'Moringa Dawn Tonic',
    category: 'Moringa',
    image: '/images/blog/moringa.jpg',
    excerpt:
      'Packed with chlorophyll and minerals, moringa makes for a bright morning tonic when paired with pineapple.',
  },
];

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
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <ProductGrid products={featuredProducts.slice(0, 3)} />
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-block rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">New Arrivals</h2>
          <ProductGrid products={newArrivals.slice(0, 3)} />
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

      {/* Wellness Blog Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              Wellness Blog
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">Herbal Wisdom</h3>
            <p className="mt-3 max-w-3xl text-gray-600">
              Ancient botanicals meet modern health science. Sign in with Google to unlock deep dives on
              Kenya&apos;s favorite herbs, recipes, and rituals.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="relative h-48 w-full">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
                    {post.category}
                  </p>
                  <h4 className="mt-2 text-xl font-bold text-slate-900">{post.title}</h4>
                  <p className="mt-3 text-sm text-slate-500 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-6">
                    <Link
                      href="/auth/signin?callback=/blog"
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Sign in to read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
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