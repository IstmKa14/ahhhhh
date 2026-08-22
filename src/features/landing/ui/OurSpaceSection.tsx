'use client';

import { LANDING_COPY } from '../constants/copy';

const { s03 } = LANDING_COPY;

// Inline botanical SVG - a simple dandelion/flower illustration matching the image
function BotanicalIllustration() {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 md:w-36 opacity-70"
      aria-hidden="true"
    >
      {/* Stem */}
      <path d="M60 190 Q58 150 62 120 Q65 100 60 60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Seed head circle */}
      <circle cx="60" cy="54" r="6" stroke="currentColor" strokeWidth="1" />
      {/* Radiating seeds */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 60 + 8 * Math.cos(angle);
        const y1 = 54 + 8 * Math.sin(angle);
        const x2 = 60 + 22 * Math.cos(angle);
        const y2 = 54 + 22 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />
        );
      })}
      {/* Floating seeds */}
      <g opacity="0.5">
        <circle cx="90" cy="30" r="2" stroke="currentColor" strokeWidth="0.8" />
        <line x1="90" y1="32" x2="88" y2="44" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="30" cy="20" r="2" stroke="currentColor" strokeWidth="0.8" />
        <line x1="30" y1="22" x2="32" y2="34" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="100" cy="60" r="1.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="100" y1="61.5" x2="99" y2="70" stroke="currentColor" strokeWidth="0.6" />
      </g>
      {/* Small leaf on stem */}
      <path d="M60 140 Q72 130 68 118" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function OurSpaceSection() {
  return (
    <section
      id="section-03"
      className="flex flex-col md:flex-row items-stretch border-b border-border"
    >
      {/* Left: text */}
      <div className="flex flex-col justify-center pt-12 pb-12 px-6 md:px-10 md:w-[60%] shrink-0 gap-6 border-b md:border-b-0 md:border-e border-border">
        {/* Section number + label */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
            {s03.number}
          </span>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
            {s03.label}
          </span>
        </div>

        <h2
          className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] text-foreground whitespace-pre-line"
          data-animate="space-headline"
        >
          {s03.headline}
        </h2>

        <p
          className="font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-xs"
          data-animate="space-body"
        >
          {s03.body}
        </p>
      </div>

      {/* Right: botanical illustration */}
      <div
        className="flex items-center justify-center flex-1 py-12 px-6 text-foreground"
        data-animate="space-botanical"
      >
        <BotanicalIllustration />
      </div>
    </section>
  );
}
