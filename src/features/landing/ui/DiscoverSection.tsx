'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';
import { LANDING_IMAGES } from '../constants/images';
import type { MoodCard } from '../types/landing.types';

const { s07 } = LANDING_COPY;

const MOOD_CARDS: MoodCard[] = [
  { label: 'Overwhelmed', imageSrc: LANDING_IMAGES.discoverOverwhelmed.src, imageAlt: LANDING_IMAGES.discoverOverwhelmed.alt },
  { label: 'Anxious',     imageSrc: LANDING_IMAGES.discoverAnxious.src,     imageAlt: LANDING_IMAGES.discoverAnxious.alt },
  { label: 'Lonely',      imageSrc: LANDING_IMAGES.discoverLonely.src,      imageAlt: LANDING_IMAGES.discoverLonely.alt },
  { label: 'Unmotivated', imageSrc: LANDING_IMAGES.discoverUnmotivated.src, imageAlt: LANDING_IMAGES.discoverUnmotivated.alt },
  { label: 'Tired',       imageSrc: LANDING_IMAGES.discoverTired.src,       imageAlt: LANDING_IMAGES.discoverTired.alt },
];

export function DiscoverSection() {
  return (
    <section
      id="section-07"
      className="flex flex-col md:flex-row items-stretch border-b border-border"
    >
      {/* Left: headline + CTA */}
      <div className="flex flex-col justify-center pt-12 pb-12 px-6 md:px-10 md:w-[32%] shrink-0 gap-6 border-b md:border-b-0 md:border-e border-border">
        {/* Section number + label */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
            {s07.number}
          </span>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
            {s07.label}
          </span>
        </div>

        <h2
          className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] text-foreground whitespace-pre-line"
          data-animate="discover-headline"
        >
          {s07.headline}
        </h2>

        <Link
          href="/resources"
          className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.18em] text-foreground border-b border-foreground pb-0.5 w-fit hover:opacity-60 transition-opacity"
          data-animate="discover-cta"
        >
          {s07.cta}
          <ArrowRight size={11} aria-hidden="true" />
        </Link>
      </div>

      {/* Right: mood cards row */}
      <div className="flex flex-row overflow-x-auto flex-1">
        {MOOD_CARDS.map((card) => (
          <div
            key={card.label}
            className="relative flex-1 min-w-[120px] min-h-[280px] md:min-h-[360px] overflow-hidden"
            data-animate="discover-card"
          >
            <Image
              src={card.imageSrc}
              alt={card.imageAlt}
              fill
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 120px, 14vw"
            />
            {/* Gradient overlay + label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 inset-x-0 text-center font-sans font-medium text-[10px] tracking-[0.1em] text-white">
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
