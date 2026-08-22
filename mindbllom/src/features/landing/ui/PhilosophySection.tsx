'use client';

import { LANDING_COPY } from '../constants/copy';

const { s08 } = LANDING_COPY;

// Botanical accent — small floating dandelion for the top-right corner
function BotanicalAccent() {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 opacity-50"
      aria-hidden="true"
    >
      <path d="M40 110 Q38 80 42 50" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="40" cy="44" r="5" stroke="currentColor" strokeWidth="0.8" />
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i * 36 * Math.PI) / 180;
        const x1 = 40 + 7 * Math.cos(angle);
        const y1 = 44 + 7 * Math.sin(angle);
        const x2 = 40 + 18 * Math.cos(angle);
        const y2 = 44 + 18 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.7" />;
      })}
      <g opacity="0.4">
        <circle cx="65" cy="20" r="2" stroke="currentColor" strokeWidth="0.7" />
        <line x1="65" y1="22" x2="63" y2="32" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="18" cy="15" r="1.5" stroke="currentColor" strokeWidth="0.7" />
        <line x1="18" y1="16.5" x2="20" y2="26" stroke="currentColor" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

export function PhilosophySection() {
  return (
    <section
      id="section-08"
      className="relative border-b border-border py-20 px-6 md:px-10"
    >
      {/* Top-right botanical accent */}
      <div
        className="absolute top-6 right-8 text-foreground"
        aria-hidden="true"
        data-animate="philosophy-botanical"
      >
        <BotanicalAccent />
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
        {/* Section number + label */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
            {s08.number}
          </span>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
            {s08.label}
          </span>
        </div>

        <h2
          className="font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.08] text-foreground whitespace-pre-line"
          data-animate="philosophy-quote"
        >
          {s08.quote}
        </h2>

        <p
          className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-2"
          data-animate="philosophy-brand"
        >
          {s08.brand}
        </p>
      </div>
    </section>
  );
}
