'use client';

import { Wind, Focus, Sunset } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';

const { s06 } = LANDING_COPY;

type ToolEntry = {
  label: string;
  Icon: LucideIcon;
};

const TOOL_ICONS: ToolEntry[] = [
  { label: 'BREATHE', Icon: Wind },
  { label: 'FOCUS', Icon: Focus },
  { label: 'UNWIND', Icon: Sunset },
];

export function ResetSection() {
  return (
    <section
      id="section-06"
      className="relative overflow-hidden bg-foreground text-background border-b border-foreground/20"
    >
      <div className="flex flex-col md:flex-row items-stretch min-h-[320px]">
        {/* Left: headline + tagline */}
        <div className="flex flex-col justify-center pt-12 pb-12 px-6 md:px-10 md:w-[50%] shrink-0 gap-4 border-b md:border-b-0 md:border-e border-background/10">
          {/* Section number + label */}
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium tracking-widest text-background/40">
              {s06.number}
            </span>
            <div className="w-px h-3 bg-background/20" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-background/40">
              {s06.label}
            </span>
          </div>

          <h2
            className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-background whitespace-pre-line"
            data-animate="reset-headline"
          >
            {s06.headline}
          </h2>

          <p className="font-sans text-xs text-background/50 tracking-wide">
            {s06.tagline}
          </p>
        </div>

        {/* Right: 3 circular tools */}
        <div className="flex flex-1 items-center justify-center gap-6 py-12 px-6 flex-wrap">
          {TOOL_ICONS.map(({ label, Icon }, index) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-full border border-background/30 hover:border-background/60 transition-colors cursor-default"
              data-animate="reset-circle"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <Icon
                size={20}
                className="text-background opacity-70"
                aria-hidden="true"
              />
              <span className="font-sans font-semibold text-[9px] tracking-[0.22em] uppercase text-background">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
