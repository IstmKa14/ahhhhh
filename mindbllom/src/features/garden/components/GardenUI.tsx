'use client';

// GardenUI: Floating spatial HTML glass/paper UI layer above the Canvas.
// Contains top navigation bar, in-world Bloom chat surface, zone locator,
// mindful breathing overlay when seated, and interaction prompt listener.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Flower2, Sparkles, Wind, Footprints } from 'lucide-react';
import { InteractionPrompt } from './InteractionPrompt';
import { QualityToggle } from './QualityToggle';
import { MobileControls, type MobileControlsHandle } from './MobileControls';
import { BloomChatPanel } from './BloomChatPanel';
import type {
  InteractiveObjectConfig,
  QualityLevel,
  BloomState,
  BloomGardenContext,
} from '../types/garden.types';

interface GardenUIProps {
  nearestObject: InteractiveObjectConfig | null;
  quality: QualityLevel;
  onQualityChange: (level: QualityLevel) => void;
  isMobile: boolean;
  mobileControlsRef: React.RefObject<MobileControlsHandle | null>;
  isChatOpen: boolean;
  onOpenChat: () => void;
  onCloseChat: () => void;
  bloomState: BloomState;
  onBloomStateChange: (state: BloomState) => void;
  gardenContext: BloomGardenContext;
  isSitting: boolean;
  onStandUp: () => void;
  activityToast: string | null;
}

export function GardenUI({
  nearestObject,
  quality,
  onQualityChange,
  isMobile,
  mobileControlsRef,
  isChatOpen,
  onOpenChat,
  onCloseChat,
  bloomState,
  onBloomStateChange,
  gardenContext,
  isSitting,
  onStandUp,
  activityToast,
}: GardenUIProps) {
  // Listen for keyboard 'E' or 'Enter' to interact with nearest object
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChatOpen) return; // don't trigger while typing in chat
      if ((e.key === 'e' || e.key === 'E') && nearestObject) {
        nearestObject.onInteract();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearestObject, isChatOpen]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-label="Garden controls"
    >
      {/* ===================== TOP BAR HUD ===================== */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-30">
        {/* Left: Mindful Return & Zone Locator */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/40 hover:bg-black/60 px-4 py-2 text-xs font-medium text-white/90 hover:text-white backdrop-blur-md border border-white/15 transition-all duration-200 shadow-md"
            aria-label="Leave Sanctuary to Dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Leave Sanctuary</span>
          </Link>

          {/* Realtime Zone Indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/35 px-3.5 py-1.5 backdrop-blur-md border border-white/15 text-white/85 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{gardenContext.zoneName}</span>
          </div>
        </div>

        {/* Right: Flower Basket, Talk to Bloom & Sanctuary Indicator */}
        <div className="flex items-center gap-2.5">
          {/* Flower Basket Badge */}
          {gardenContext.flowersPickedCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-pink-950/50 px-3 py-1.5 backdrop-blur-md border border-pink-400/30 text-pink-200 text-xs font-medium">
              <Flower2 className="h-3.5 w-3.5 text-pink-300" />
              <span>{gardenContext.flowersPickedCount} gathered</span>
            </div>
          )}

          {/* Talk to Bloom Action Button */}
          <button
            onClick={onOpenChat}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-emerald-600/80 hover:bg-emerald-500/90 px-4 py-2 backdrop-blur-md border border-emerald-400/40 text-white text-xs font-medium transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
            aria-label="Talk to Bloom"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-100" />
            <span>Talk to Bloom</span>
          </button>
        </div>
      </div>

      {/* ===================== ACTIVITY TOAST NOTIFICATION ===================== */}
      {activityToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-30 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 rounded-full bg-emerald-900/80 px-4 py-1.5 backdrop-blur-md border border-emerald-400/40 text-emerald-100 text-xs font-medium shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300 animate-spin" />
            <span>{activityToast}</span>
          </div>
        </div>
      )}

      {/* ===================== SEATED MINDFUL MEDITATION OVERLAY ===================== */}
      {isSitting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 bg-black/20 backdrop-blur-[2px] transition-all">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-300/30 animate-pulse">
              <Wind className="h-8 w-8 text-emerald-200" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white font-medium tracking-wide">
                Mindful Sanctuary Breath
              </h2>
              <p className="font-body text-xs text-white/70 mt-1">
                Breathe in the calm... Breathe out the tension.
              </p>
            </div>
            <button
              onClick={onStandUp}
              className="pointer-events-auto mt-3 flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 px-5 py-2 text-xs font-medium text-white backdrop-blur-md border border-white/30 transition-all shadow-md"
            >
              <Footprints className="h-3.5 w-3.5" />
              <span>Stand Up & Explore</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== IN-WORLD BLOOM CHAT SURFACE ===================== */}
      <BloomChatPanel
        isOpen={isChatOpen}
        onClose={onCloseChat}
        gardenContext={gardenContext}
        onBloomStateChange={onBloomStateChange}
      />

      {/* ===================== CONTEXTUAL PROXIMITY PROMPT ===================== */}
      {!isSitting && !isChatOpen && (
        <InteractionPrompt object={nearestObject} />
      )}

      {/* ===================== BOTTOM RIGHT: QUALITY TOGGLE ===================== */}
      <QualityToggle quality={quality} onQualityChange={onQualityChange} />

      {/* ===================== BOTTOM LEFT: MOBILE JOYSTICK ===================== */}
      {isMobile && !isChatOpen && (
        <MobileControls ref={mobileControlsRef} />
      )}
    </div>
  );
}

