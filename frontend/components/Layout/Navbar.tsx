import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import UserMenu from '../Auth/UserMenu';

const navLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Wellness Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-deedees-hw.svg"
            alt="DeeDees Health & Wellness logo"
            width={200}
            height={56}
            priority
            className="hidden sm:block"
          />
          <Image
            src="/logo-mark.png"
            alt="DeeDees monogram"
            width={48}
            height={48}
            className="sm:hidden"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <UserMenu />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <span className="text-lg">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 hover:bg-primary-50 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

