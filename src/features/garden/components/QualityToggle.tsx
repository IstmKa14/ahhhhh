'use client';

// QualityToggle: lets the user switch between Low, Medium, and High render quality.
// Positioned bottom-right. Subtle and unobtrusive so it doesn't compete with the Garden.
// Uses design tokens only. No hardcoded colors.

import type { QualityLevel } from '../types/garden.types';

const LEVELS: QualityLevel[] = ['low', 'medium', 'high'];
const LABELS: Record<QualityLevel, string> = {
  low: 'Lo',
  medium: 'Med',
  high: 'Hi',
};

interface QualityToggleProps {
  quality: QualityLevel;
  onQualityChange: (level: QualityLevel) => void;
}

export function QualityToggle({ quality, onQualityChange }: QualityToggleProps) {
  return (
    <div
      className="absolute bottom-6 right-6 pointer-events-auto"
      role="group"
      aria-label="Render quality"
    >
      <div className="flex gap-1 rounded-full bg-black/30 p-1 backdrop-blur-sm border border-white/10">
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onQualityChange(level)}
            aria-pressed={quality === level}
            aria-label={`Set quality to ${level}`}
            className={[
              'font-body text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200',
              quality === level
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:text-white/80',
            ].join(' ')}
          >
            {LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  );
}
