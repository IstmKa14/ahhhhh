'use client';

// GardenUI: Floating spatial HTML glass/paper UI layer above the Canvas.
// Contains top navigation bar, contextual floating action bubble,
// plant care info, quality toggle, and mobile virtual joystick.

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Sparkles, Sprout } from 'lucide-react';
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
  const [showChatModal, setShowChatModal] = useState(false);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-label="Garden controls"
    >
      {/* Top Bar: Mindful Back Navigation, Zen Indicator, and Quick Bloom Chat */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15 hover:bg-black/55 hover:text-white transition-all duration-200 shadow-sm"
            aria-label="Return to Dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Leave Sanctuary</span>
          </Link>
          {!isMobile && (
            <span className="hidden sm:inline-block font-body text-xs text-white/60 tracking-widest uppercase select-none drop-shadow">
              WASD · Walk & Explore
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Chat with Bloom Floating Button */}
          <Link
            href="/chat"
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-emerald-700/65 hover:bg-emerald-600/80 px-3.5 py-1.5 backdrop-blur-md border border-emerald-400/30 text-white text-xs font-medium transition-all duration-200 shadow-sm"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-200" />
            <span>Talk to Bloom</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md border border-white/15">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-body text-xs font-medium text-white/90">Bloom Sanctuary</span>
          </div>
        </div>
      </div>

      {/* Center Floating Guide Badge for new visitors */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex items-center gap-2 rounded-full bg-black/25 px-4 py-1.5 backdrop-blur-md border border-white/10 text-white/70 text-xs">
        <Sprout className="h-3.5 w-3.5 text-emerald-300" />
        <span>Click terracotta pots to water seeds · Walk to pond or bench to rest</span>
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
