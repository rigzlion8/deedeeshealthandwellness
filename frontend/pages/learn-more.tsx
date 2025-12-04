import Head from 'next/head';
import Link from 'next/link';

const LearnMorePage = () => {
  return (
    <>
      <Head>
        <title>Learn More | DeeDees Health &amp; Wellness</title>
        <meta
          name="description"
          content="Discover DeeDees Health & Wellness—our philosophy, ingredients, and commitment to natural Kenyan botanicals."
        />
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              Learn More
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Our Herbal Philosophy</h1>
            <p className="mt-3 text-slate-600">
              We blend modern science with ancestral Kenyan herbal knowledge to craft products that are safe,
              effective, and sustainable.
            </p>
          </header>

          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What We Stand For</h2>
            <ul className="space-y-2 text-slate-600">
              <li>• 100% natural botanicals sourced responsibly in Kenya</li>
              <li>• Gentle formulations for skin, body, and holistic wellness</li>
              <li>• Transparent ingredients and thoughtful craftsmanship</li>
              <li>• Community empowerment and sustainable practices</li>
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Ingredients We Love</h2>
            <p className="text-slate-600">
              Moringa, baobab, blue lotus, cloves, lemongrass, and other time-honored botanicals feature in our
              remedies, teas, and skincare rituals. Each ingredient is chosen for purity, potency, and harmony with
              your body.
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
            >
              Shop Products
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              About DeeDees
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnMorePage;

