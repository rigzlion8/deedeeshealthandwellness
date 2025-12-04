import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const BLOG_POSTS = [
  {
    slug: 'blue-lotus-serenity',
    title: 'Blue Lotus: The Ritual of Serenity',
    category: 'Blue Lotus',
    image: '/images/blog/blue-lotus.jpg',
    description:
      'The sacred Blue Lotus flower is used in herbal baths, infusions, and incense to bring deep repose. Learn breathing techniques and steeping times for bedtime ceremonies.',
  },
  {
    slug: 'clove-warming-elixir',
    title: 'Cloves & Wild Honey Warming Elixir',
    category: 'Cloves',
    image: '/images/blog/cloves.jpg',
    description:
      'Eugenol-rich clove buds create a circulation-boosting drink when blended with honey and tamarind. We cover roasting methods, dosages, and when to sip.',
  },
  {
    slug: 'moringa-dawn-tonic',
    title: 'Moringa Dawn Tonic',
    category: 'Moringa',
    image: '/images/blog/moringa.jpg',
    description:
      "Packed with chlorophyll, moringa powder blends beautifully with pineapple, ginger, and coconut water. Here's how to build an energizing morning tonic.",
  },
  {
    slug: 'ashwagandha-balance',
    title: 'Ashwagandha for Evening Balance',
    category: 'Ashwagandha',
    image: '/images/blog/ashwagandha.jpg',
    description:
      'Adaptogenic root taken with coconut milk calms cortisol and anchors restful sleep. We explore Kenyan sourcing, dosage, and pairing with meditation.',
  },
  {
    slug: 'lemongrass-cleansing-steam',
    title: 'Lemongrass Cleansing Steam',
    category: 'Lemongrass',
    image: '/images/blog/lemongrass.jpg',
    description:
      'Create a fragrant steam therapy with lemongrass, eucalyptus, and Kenyan sea salt to reset breathing and clear the mind.',
  },
  {
    slug: 'coconut-oil-rituals',
    title: 'Coconut Oil: Nature\'s Multi-Purpose Elixir',
    category: 'Coconut Oil',
    image: '/images/blog/coconutoils.jpg',
    description:
      'From hair masks to cooking, discover the versatile benefits of pure coconut oil in your daily wellness and beauty routines.',
  },
];

const BlogPage = () => {
  return (
    <>
      <Head>
        <title>Wellness Blog | DeeDees Health &amp; Wellness</title>
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              Wellness Blog
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Herbal Wisdom Library</h1>
            <p className="mt-4 text-lg text-slate-600">
              Sign in with Google to unlock full interviews, rituals, and recipes from the DeeDees
              apothecary team.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signin?callback=/blog"
                className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
              >
                Sign in with Google
              </Link>
            </div>
          </header>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-64 w-full">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
                    {post.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{post.title}</h2>
                  <p className="mt-4 text-slate-600">{post.description}</p>
                  <div className="mt-auto pt-6">
                    <Link
                      href="/auth/signin?callback=/blog"
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Sign in to continue reading →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;

