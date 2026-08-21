'use client';

import { ArrowRight } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';

const { s09 } = LANDING_COPY;

export function HowItWorksSection() {
  return (
    <section
      id="section-09"
      className="border-b border-border"
    >
      {/* Section number + label row */}
      <div className="flex items-center gap-2 px-6 md:px-10 pt-8 pb-4">
        <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
          {s09.number}
        </span>
        <div className="h-px w-3 bg-border" aria-hidden="true" />
        <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
          {s09.label}
        </span>
      </div>

      {/* Steps row */}
      <div className="flex flex-col sm:flex-row items-stretch border-t border-border">
        {s09.steps.map((step, index) => (
          <div key={step.num} className="flex flex-row sm:flex-1 items-center">
            {/* Step card */}
            <div
              className="flex-1 flex flex-col gap-3 px-6 md:px-8 py-8 border-b sm:border-b-0 sm:border-e border-border"
              data-animate="step"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <span className="font-serif text-[4.5rem] md:text-[5.5rem] text-foreground leading-none select-none">
                {step.num}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-foreground">
                  {step.title}
                </span>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {step.body}
                </p>
              </div>
            </div>

            {/* Arrow separator between steps */}
            {index < s09.steps.length - 1 && (
              <ArrowRight
                size={16}
                className="text-muted-foreground mx-2 shrink-0 hidden sm:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
