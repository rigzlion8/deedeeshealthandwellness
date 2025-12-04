import Head from 'next/head';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About | DeeDees Health &amp; Wellness</title>
        <meta
          name="description"
          content="Learn about DeeDees Health & Wellness—our story, mission, and commitment to natural Kenyan botanicals."
        />
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              About
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Our Story</h1>
            <p className="mt-3 text-slate-600">
              DeeDees Health & Wellness was founded to celebrate Kenyan herbal wisdom. We craft products that honor
              tradition, embrace science, and deliver real results for your wellbeing.
            </p>
          </header>

          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Mission</h2>
            <p className="text-slate-600">
              To make trusted, nature-led wellness accessible—empowering our community with safe, transparent,
              and effective products sourced responsibly from Kenya and beyond.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What Guides Us</h2>
            <ul className="space-y-2 text-slate-600">
              <li>• Integrity in sourcing and formulation</li>
              <li>• Respect for ancestral herbal knowledge</li>
              <li>• Sustainability for people and planet</li>
              <li>• Education and transparency for our customers</li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
            >
              Shop Products
            </Link>
            <Link
              href="/learn-more"
              className="rounded-full border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;

