'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';
import { LANDING_IMAGES } from '../constants/images';

const { s10 } = LANDING_COPY;

export function SupportSection() {
  return (
    <section
      id="section-10"
      className="flex flex-col md:flex-row items-stretch border-b border-border min-h-[420px]"
    >
      {/* Left: staircase photo */}
      <div className="relative min-h-[300px] md:min-h-0 md:w-[45%] shrink-0 border-b md:border-b-0 md:border-e border-border">
        <Image
          src={LANDING_IMAGES.supportStairs.src}
          alt={LANDING_IMAGES.supportStairs.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 45vw"
          data-animate="support-photo"
        />
      </div>

      {/* Right: text */}
      <div className="flex flex-col justify-center pt-12 pb-12 px-6 md:px-12 flex-1 gap-6">
        {/* Section number + label */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
            {s10.number}
          </span>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
            {s10.label}
          </span>
        </div>

        <h2
          className="font-serif text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.2] text-foreground whitespace-pre-line"
          data-animate="support-headline"
        >
          {s10.headline}
        </h2>

        <p
          className="font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-md"
          data-animate="support-body"
        >
          {s10.body}
        </p>

        <Link
          href="/resources"
          className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.18em] text-foreground border-b border-foreground pb-0.5 w-fit hover:opacity-60 transition-opacity"
          data-animate="support-cta"
        >
          {s10.cta}
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
