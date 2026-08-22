'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';
import { LANDING_IMAGES } from '../constants/images';

const { s05 } = LANDING_COPY;

// Small tree botanical illustration
function TreeIllustration() {
  return (
    <svg
      viewBox="0 0 80 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 md:w-20 opacity-80"
      aria-hidden="true"
    >
      {/* Trunk */}
      <path d="M40 155 L40 90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Ground mound */}
      <path d="M28 155 Q40 148 52 155" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Main branches */}
      <path d="M40 110 Q30 95 22 85" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M40 100 Q50 85 58 75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M40 90 Q35 72 38 58" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Sub branches */}
      <path d="M22 85 Q16 76 14 68" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M22 85 Q26 74 28 65" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M58 75 Q64 66 66 58" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M58 75 Q54 64 56 56" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M38 58 Q34 46 36 36" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M38 58 Q44 47 48 38" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* Top */}
      <path d="M36 36 Q38 24 40 16" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="12" r="2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function ReflectSection() {
  return (
    <section
      id="section-05"
      className="flex flex-col md:flex-row items-stretch border-b border-border min-h-[420px]"
    >
      {/* Left: text */}
      <div className="flex flex-col justify-center pt-12 pb-12 px-6 md:px-10 md:w-[42%] shrink-0 gap-6 border-b md:border-b-0 md:border-e border-border">
        {/* Section number + label */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
            {s05.number}
          </span>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
            {s05.label}
          </span>
        </div>

        <h2
          className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] text-foreground whitespace-pre-line"
          data-animate="reflect-headline"
        >
          {s05.headline}
        </h2>

        <p
          className="font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-xs"
          data-animate="reflect-body"
        >
          {s05.body}
        </p>

        <Link
          href="/journal"
          className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.18em] text-foreground border-b border-foreground pb-0.5 w-fit hover:opacity-60 transition-opacity"
          data-animate="reflect-cta"
        >
          {s05.cta}
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>

      {/* Center: botanical illustration */}
      <div
        className="hidden md:flex items-center justify-center w-[16%] shrink-0 border-e border-border text-foreground py-12"
        data-animate="reflect-botanical"
        aria-hidden="true"
      >
        <TreeIllustration />
      </div>

      {/* Right: journal photo */}
      <div className="relative flex-1 min-h-[280px] md:min-h-0">
        <Image
          src={LANDING_IMAGES.reflectJournal.src}
          alt={LANDING_IMAGES.reflectJournal.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 42vw"
          data-animate="reflect-photo"
        />
      </div>
    </section>
  );
}
