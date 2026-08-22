'use client';

// GardenExperience: top-level composition for the MindBloom Garden world.
// Owns player state, Bloom companion state, in-world conversation,
// zone localization, flower inventory, and sitting meditation mechanics.

import { useState, useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useQualityLevel } from '../performance/useQualityLevel';
import { GardenCanvas } from './GardenCanvas';
import { GardenUI } from './GardenUI';
import { GardenErrorBoundary } from './GardenErrorBoundary';
import type { MobileControlsHandle } from './MobileControls';
import type {
  InteractiveObjectConfig,
  VelocityVector,
  BloomState,
  BloomGardenContext,
  GardenZoneId,
} from '../types/garden.types';
import { GARDEN_ZONES } from '../constants/garden.constants';
import { getTerrainHeight } from '../utils/terrainMath';

function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.navigator.maxTouchPoints > 0;
}

export function GardenExperience() {
  const { quality, profile, setQuality } = useQualityLevel();
  const [nearestObject, setNearestObject] = useState<InteractiveObjectConfig | null>(null);
  const [isMobile] = useState<boolean>(detectMobile);
  const mobileControlsRef = useRef<MobileControlsHandle | null>(null);

  // Player & Sitting State
  const playerPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 16));
  const [isSitting, setIsSitting] = useState(false);
  const [sittingPosition, setSittingPosition] = useState<[number, number, number] | null>(null);

  // Player Action Animation State Machine ('idle' | 'walk' | 'pick' | 'water' | 'sit' | 'touch_water')
  const [actionState, setActionState] = useState<'idle' | 'walk' | 'pick' | 'water' | 'sit' | 'touch_water'>('idle');

  // Bloom Character & Chat State
  const [bloomState, setBloomState] = useState<BloomState>('idle');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const bloomPosition: [number, number, number] = [2.2, getTerrainHeight(2.2, -1.8), -1.8];

  // Gamification & Environmental Feedback
  const [flowersPickedCount, setFlowersPickedCount] = useState(0);
  const [activityToast, setActivityToast] = useState<string | null>(null);
  const [currentZoneId, setCurrentZoneId] = useState<GardenZoneId>('entrance');
  const [currentZoneName, setCurrentZoneName] = useState('Sanctuary Gate');
  const [recentAction, setRecentAction] = useState<string>('Entering the sanctuary');

  // Trigger temporary toast
  const showToast = useCallback((msg: string) => {
    setActivityToast(msg);
    setTimeout(() => {
      setActivityToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Update zone location in background interval
  useEffect(() => {
    const interval = setInterval(() => {
      const pos = playerPositionRef.current;
      if (!pos) return;

      let closestZone = GARDEN_ZONES[0];
      let minDistance = 999;

      for (const zone of GARDEN_ZONES) {
        const dx = pos.x - zone.center[0];
        const dz = pos.z - zone.center[1];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDistance) {
          minDistance = dist;
          closestZone = zone;
        }
      }

      if (closestZone.id !== currentZoneId) {
        setCurrentZoneId(closestZone.id);
        setCurrentZoneName(closestZone.name);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [currentZoneId]);

  const handleNearestChange = useCallback((object: InteractiveObjectConfig | null) => {
    setNearestObject(object);
  }, []);

  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true);
    setBloomState('listening');
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setBloomState('idle');
  }, []);

  const handleSitBench = useCallback((pos: [number, number, number]) => {
    setIsSitting(true);
    setSittingPosition(pos);
    setActionState('sit');
    setRecentAction('Sitting on the bench taking mindful breaths');
    showToast('🧘 Resting on the bench... Take a slow, peaceful breath.');
  }, [showToast]);

  const handleStandUp = useCallback(() => {
    setIsSitting(false);
    setSittingPosition(null);
    setActionState('idle');
    setRecentAction('Standing up to explore the garden');
  }, []);

  const handlePickFlower = useCallback((name: string, _color: string) => {
    setActionState('pick');
    setFlowersPickedCount((prev) => prev + 1);
    setRecentAction(`Picked a fragrant ${name}`);
    showToast(`🌸 Gathered ${name}`);

    // Return to idle after reach-down animation finishes
    setTimeout(() => {
      setActionState('idle');
    }, 1400);
  }, [showToast]);

  const handleWaterPlant = useCallback((_potId: string, plantName: string) => {
    setActionState('water');
    setRecentAction(`Watered ${plantName}`);
    showToast(`💧 Nourishing ${plantName} with vintage watering can...`);

    // Return to idle after watering spray animation finishes
    setTimeout(() => {
      setActionState('idle');
    }, 2200);
  }, [showToast]);

  const handleTouchWater = useCallback(() => {
    setActionState('touch_water');
    setRecentAction('Touched the calm pond ripples');
    showToast('🌊 Gentle ripples drift across the water');
    setTimeout(() => {
      setActionState('idle');
    }, 1200);
  }, [showToast]);

  const handleDiscovery = useCallback((text: string) => {
    showToast(text);
  }, [showToast]);

  const gardenContext: BloomGardenContext = {
    currentZone: currentZoneId,
    zoneName: currentZoneName,
    isSitting,
    flowersPickedCount,
    nearbyObjectName: nearestObject?.promptLabel,
    recentAction,
  };

  const mobileVelocityRef: React.RefObject<VelocityVector> | undefined = isMobile
    ? mobileControlsRef.current?.velocityRef
    : undefined;

  return (
    <div className="relative h-full w-full" role="main" aria-label="MindBloom Garden">
      <GardenErrorBoundary>
        <GardenCanvas
          profile={profile}
          bloomState={bloomState}
          onOpenChat={handleOpenChat}
          mobileVelocityRef={mobileVelocityRef}
          onNearestChange={handleNearestChange}
          isSitting={isSitting}
          sittingPosition={sittingPosition}
          onSitBench={handleSitBench}
          onStandUp={handleStandUp}
          onTouchWater={handleTouchWater}
          onPickFlower={handlePickFlower}
          onWaterPlant={handleWaterPlant}
          onTriggerDiscovery={handleDiscovery}
          actionState={actionState}
          isFocusingBloom={isChatOpen}
          bloomPosition={bloomPosition}
          playerPositionRef={playerPositionRef}
        />
      </GardenErrorBoundary>

      <GardenUI
        nearestObject={nearestObject}
        quality={quality}
        onQualityChange={setQuality}
        isMobile={isMobile}
        mobileControlsRef={mobileControlsRef}
        isChatOpen={isChatOpen}
        onOpenChat={handleOpenChat}
        onCloseChat={handleCloseChat}
        bloomState={bloomState}
        onBloomStateChange={setBloomState}
        gardenContext={gardenContext}
        isSitting={isSitting}
        onStandUp={handleStandUp}
        activityToast={activityToast}
      />
    </div>
  );
}

