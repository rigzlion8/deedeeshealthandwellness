import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface HeroStat {
  label: string;
  value: string;
}

interface HeroBannerProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  ctaText: string;
  ctaLink: string;
  stats?: HeroStat[];
}

const FALLBACK_STATS: HeroStat[] = [
  { label: 'Happy Clients', value: '5K+' },
  { label: 'Natural Blends', value: '120' },
  { label: 'Wellness Guides', value: '24/7' },
];

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  ctaLink,
  stats,
}) => {
  const displayStats = stats && stats.length ? stats : FALLBACK_STATS;

  return (
    <section className="relative overflow-hidden bg-primary-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:items-stretch">
        <div className="w-full max-w-2xl space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center justify-center rounded-full border border-primary-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary-600 lg:justify-start">
            DeeDees Health & Wellness
          </span>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">{subtitle}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={ctaLink}
              className="rounded-lg bg-primary-600 px-8 py-3 text-center font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700"
            >
              {ctaText}
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-primary-200 px-8 py-3 text-center font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-400"
            >
              Learn More
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 text-left shadow-lg backdrop-blur-sm sm:grid-cols-3">
            {displayStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-x-6 -inset-y-6 hidden rounded-[40px] bg-gradient-to-r from-primary-100 to-secondary-100 opacity-70 blur-3xl lg:block" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[36px] bg-white shadow-2xl">
            <Image
              src={imageUrl || '/hero-banner.jpg'}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/85 p-4 text-left shadow-lg backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Featured Ritual
              </p>
              <p className="text-lg font-bold text-slate-900">
                Revitalize with Kenyan botanicals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

