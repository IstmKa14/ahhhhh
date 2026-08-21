'use client';

// InteractionPrompt: contextual label shown when the player is near an interactive object.
// Rendered in GardenUI (React layer above the canvas), never inside Three.js.
// Uses design tokens from design.md. No hardcoded colors.

import type { InteractiveObjectConfig } from '../types/garden.types';

interface InteractionPromptProps {
  object: InteractiveObjectConfig | null;
}

export function InteractionPrompt({ object }: InteractionPromptProps) {
  if (!object) return null;

  return (
    <div
      className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
      role="status"
      aria-live="polite"

      >
      <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm border border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" aria-hidden="true" />
        <span className="font-body text-sm font-medium text-white/90 tracking-wide">
          {object.promptLabel}
        </span>
        <kbd className="font-body text-xs text-white/50 ml-1">[E]</kbd>
      </div>
    </div>
  );
}
