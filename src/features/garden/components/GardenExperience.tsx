'use client';

// GardenExperience: top-level composition for the Garden feature.
// Owns the quality state and mobile detection.
// Renders GardenCanvas and GardenUI as sibling absolute layers inside
// a full-height container.

import { useState, useCallback, useRef } from 'react';
import { useQualityLevel } from '../performance/useQualityLevel';
import { GardenCanvas } from './GardenCanvas';
import { GardenUI } from './GardenUI';
import { GardenErrorBoundary } from './GardenErrorBoundary';
import type { MobileControlsHandle } from './MobileControls';
import type { InteractiveObjectConfig, VelocityVector } from '../types/garden.types';

function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.navigator.maxTouchPoints > 0;
}

export function GardenExperience() {
  const { quality, profile, setQuality } = useQualityLevel();
  const [nearestObject, setNearestObject] = useState<InteractiveObjectConfig | null>(null);
  const [isMobile] = useState<boolean>(detectMobile);
  const mobileControlsRef = useRef<MobileControlsHandle | null>(null);

  const handleNearestChange = useCallback((object: InteractiveObjectConfig | null) => {
    setNearestObject(object);
  }, []);

  // Derive the mobile velocity ref from the joystick handle on each render.
  // GardenCanvas reads this ref via useFrame so stale closures are not an issue.
  const mobileVelocityRef: React.RefObject<VelocityVector> | undefined = isMobile
    ? mobileControlsRef.current?.velocityRef
    : undefined;

  return (
    <div className="relative h-full w-full" role="main" aria-label="MindBloom Garden">
      <GardenErrorBoundary>
        <GardenCanvas
          profile={profile}
          mobileVelocityRef={mobileVelocityRef}
          onNearestChange={handleNearestChange}
        />
      </GardenErrorBoundary>

      <GardenUI
        nearestObject={nearestObject}
        quality={quality}
        onQualityChange={setQuality}
        isMobile={isMobile}
        mobileControlsRef={mobileControlsRef}
      />
    </div>
  );
}
