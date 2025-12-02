import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?filter=new' },
      { label: 'Best Sellers', href: '/products?filter=popular' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Wellness Guides', href: '/blog' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Support', href: '/support' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-deedees-hw.svg" alt="DeeDees logo" width={220} height={64} />
          </Link>
          <p className="text-sm text-slate-400">
            Holistic health rituals and botanicals crafted for DeeDees Health &amp; Wellness.
          </p>
          <div className="flex gap-3">
            <Link
              href="https://instagram.com/deedees"
              aria-label="DeeDees on Instagram"
              className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 transition hover:border-primary-400 hover:text-primary-300"
            >
              <Image src="/logo-mark.png" alt="DeeDees icon" width={28} height={28} />
            </Link>
            <Link
              href="https://facebook.com/deedees"
              aria-label="DeeDees on Facebook"
              className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 transition hover:border-primary-400 hover:text-primary-300"
            >
              <span className="text-lg font-semibold">f</span>
            </Link>
            <Link
              href="https://pinterest.com/deedees"
              aria-label="DeeDees on Pinterest"
              className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 transition hover:border-primary-400 hover:text-primary-300"
            >
              <span className="text-lg font-semibold">P</span>
            </Link>
          </div>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-300">
              {group.title}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link className="transition hover:text-primary-200" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} DeeDees Health &amp; Wellness. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

