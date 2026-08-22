'use client';

import Image from 'next/image';
import { LANDING_COPY } from '../constants/copy';
import { LANDING_IMAGES } from '../constants/images';

const { s02 } = LANDING_COPY;

export function FeelingSection() {
  return (
    <section
      id="section-02"
      className="flex flex-col md:flex-row border-b border-border min-h-[480px]"
    >
      {/* Left: text + pills */}
      <div className="flex flex-col justify-start pt-10 pb-10 px-6 md:px-10 md:w-[45%] shrink-0 border-b md:border-b-0 md:border-e border-border gap-6">
        {/* Section number + label */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
            {s02.number}
          </span>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
            {s02.label}
          </span>
        </div>

        <h2
          className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] text-foreground whitespace-pre-line"
          data-animate="feeling-headline"
        >
          {s02.headline}
        </h2>

        <ul className="flex flex-col mt-2" aria-label="Common student stressors">
          {s02.pills.map((pill) => (
            <li
              key={pill}
              className="font-sans font-medium text-[10px] tracking-[0.18em] uppercase text-foreground border-b border-border py-2.5 w-full"
              data-animate="feeling-pill"
            >
              {pill}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: full-bleed photo */}
      <div className="relative flex-1 min-h-[320px] md:min-h-0">
        <Image
          src={LANDING_IMAGES.feeling.src}
          alt={LANDING_IMAGES.feeling.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 55vw"
          data-animate="feeling-photo"
        />
      </div>
    </section>
  );
}
