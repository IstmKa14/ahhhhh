'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';

export function Navbar() {
  return (
    <header
      className="fixed top-0 z-50 w-full bg-background/90 backdrop-blur-sm border-b border-border"
      data-animate="navbar"
    >
      <div className="flex items-center justify-between h-14 px-6 md:px-10">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-sans font-semibold text-[11px] tracking-[0.22em] text-foreground hover:opacity-70 transition-opacity"
          aria-label="MindBloom home"
        >
          {LANDING_COPY.nav.wordmark}
        </Link>

        {/* Desktop nav links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
          {LANDING_COPY.nav.links.map((link) => (
            <Link
              key={link}
              href={link === 'SIGN IN' ? '/login' : `/${link.toLowerCase()}`}
              className="font-sans font-medium text-[10px] tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open navigation menu"
          className="md:hidden text-foreground hover:opacity-70 transition-opacity"
        >
          <Menu size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
