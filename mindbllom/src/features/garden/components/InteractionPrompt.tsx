'use client';

// InteractionPrompt: contextual label shown when the player is near an interactive object.
// Rendered in GardenUI (React layer above the canvas).
// Can be clicked/tapped directly or triggered with [E] keyboard shortcut.

import type { InteractiveObjectConfig } from '../types/garden.types';

interface InteractionPromptProps {
  object: InteractiveObjectConfig | null;
}

export function InteractionPrompt({ object }: InteractionPromptProps) {
  if (!object) return null;

  return (
    <div
      className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-auto z-30 animate-in fade-in slide-in-from-bottom-2 duration-150"
      role="status"
      aria-live="polite"
    >
      <button
        onClick={() => object.onInteract()}
        className="flex items-center gap-2 rounded-full bg-black/50 hover:bg-black/70 active:scale-95 px-5 py-2.5 backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-all"
        aria-label={object.promptLabel}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
        <span className="font-body text-xs sm:text-sm font-medium text-white tracking-wide">
          {object.promptLabel}
        </span>
        <kbd className="font-body text-[10px] sm:text-xs text-white/70 ml-1 px-1.5 py-0.5 rounded bg-white/15 border border-white/20">
          {object.actionKey || 'E'}
        </kbd>
      </button>
    </div>
  );
}

