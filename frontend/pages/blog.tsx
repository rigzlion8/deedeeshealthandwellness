import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const BLOG_POSTS = [
  {
    slug: 'lotus-flower-serenity',
    title: 'Lotus Flower: The Ritual of Serenity',
    category: 'Lotus Flower',
    image: 'https://images.unsplash.com/photo-1523419409543-0c1df022bddb?auto=format&fit=crop&w=1200&q=80',
    description:
      'Lotus petals and seed pods are used in Kenyan herbal baths, infusions, and incense to bring repose. Learn breathing techniques and steeping times for bedtime ceremonies.',
  },
  {
    slug: 'clove-warming-elixir',
    title: 'Cloves & Wild Honey Warming Elixir',
    category: 'Cloves',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80',
    description:
      'Eugenol-rich clove buds create a circulation-boosting drink when blended with honey and tamarind. We cover roasting methods, dosages, and when to sip.',
  },
  {
    slug: 'ashwagandha-balance',
    title: 'Ashwagandha for Evening Balance',
    category: 'Ashwagandha',
    image: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=1200&q=80',
    description:
      'Adaptogenic root taken with coconut milk calms cortisol and anchors restful sleep. We explore Kenyan sourcing, dosage, and pairing with meditation.',
  },
  {
    slug: 'moringa-dawn-tonic',
    title: 'Moringa Dawn Tonic',
    category: 'Moringa',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80',
    description:
      'Packed with chlorophyll, moringa powder blends beautifully with pineapple, ginger, and coconut water. Here’s how to build an energizing morning tonic.',
  },
  {
    slug: 'lemongrass-cleansing-steam',
    title: 'Lemongrass Cleansing Steam',
    category: 'Lemongrass',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    description:
      'Create a fragrant steam therapy with lemongrass, eucalyptus, and Kenyan sea salt to reset breathing and clear the mind.',
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

