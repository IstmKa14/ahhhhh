'use client';

// GardenUI: the React HTML layer above the canvas.
// Absolutely positioned, inset 0, pointer-events none by default.
// Provides mindful navigation back to app, contextual interaction prompts,
// quality controls, and mobile virtual joystick.

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { InteractionPrompt } from './InteractionPrompt';
import { QualityToggle } from './QualityToggle';
import { MobileControls, type MobileControlsHandle } from './MobileControls';
import type { InteractiveObjectConfig, QualityLevel } from '../types/garden.types';

interface GardenUIProps {
  nearestObject: InteractiveObjectConfig | null;
  quality: QualityLevel;
  onQualityChange: (level: QualityLevel) => void;
  isMobile: boolean;
  mobileControlsRef: React.RefObject<MobileControlsHandle | null>;
}

export function GardenUI({
  nearestObject,
  quality,
  onQualityChange,
  isMobile,
  mobileControlsRef,
}: GardenUIProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-label="Garden controls"
    >
      {/* Top Bar: Mindful Back Navigation & Zen Indicator */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md border border-white/10 hover:bg-black/40 hover:text-white transition-all duration-200"
            aria-label="Return to Dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Leave Sanctuary</span>
          </Link>
          {!isMobile && (
            <span className="hidden sm:inline-block font-body text-xs text-white/40 tracking-widest uppercase select-none">
              WASD · Explore Garden
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-md border border-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400/80 animate-pulse" />
          <span className="font-body text-xs font-medium text-white/80">Bloom Sanctuary</span>
        </div>
      </div>

      {/* Bottom center: contextual interaction prompt */}
      <InteractionPrompt object={nearestObject} />

      {/* Bottom right: quality toggle */}
      <QualityToggle quality={quality} onQualityChange={onQualityChange} />

      {/* Bottom left: mobile joystick (touch only) */}
      {isMobile && (
        <MobileControls ref={mobileControlsRef} />
      )}
    </div>
  );
}
