'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';

const { s01 } = LANDING_COPY;

export function HeroSection() {
  return (
    <section
      id="section-01"
      className="relative min-h-screen flex items-start pt-28 pb-16 px-6 md:px-10 border-b border-border"
    >
      {/* Left gutter: section number + label */}
      <div className="hidden md:flex flex-col items-start gap-1 pt-1 w-16 shrink-0 select-none">
        <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
          {s01.number}
        </span>
        <div className="w-px h-4 bg-border" aria-hidden="true" />
        <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
          {s01.label}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 max-w-4xl">
        <h1
          className="font-serif text-[clamp(3rem,7.5vw,6.5rem)] leading-[1.02] text-foreground whitespace-pre-line"
          data-animate="hero-headline"
        >
          {s01.headline}
        </h1>

        <p
          className="font-sans text-sm text-muted-foreground leading-relaxed mt-6 max-w-sm whitespace-pre-line"
          data-animate="hero-body"
        >
          {s01.body}
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 mt-8 font-sans font-semibold text-[10px] tracking-[0.18em] text-foreground border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
          data-animate="hero-cta"
        >
          {s01.cta}
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>

      {/* Right: SCROLL hint */}
      <div
        className="hidden lg:flex flex-col items-center gap-2 absolute right-10 bottom-12 select-none"
        aria-hidden="true"
      >
        <span
          className="font-sans text-[9px] font-medium tracking-[0.25em] text-muted-foreground"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {s01.scrollHint}
        </span>
        <div className="w-px h-8 bg-border" />
      </div>
    </section>
  );
}
