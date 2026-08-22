'use client';

// GardenCanvas: the R3F Canvas layer.
// Contains all Three.js content. Never imports React UI components.
// Quality profile drives shadows, DPR, and antialias settings.

import { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GardenScene } from '../scene/GardenScene';
import { Player } from '../player/Player';
import { InteractionDetector } from '../systems/InteractionDetector';
import type { InteractiveObjectConfig, QualityProfile, VelocityVector, BloomState } from '../types/garden.types';

interface GardenCanvasProps {
  profile: QualityProfile;
  bloomState: BloomState;
  onOpenChat: () => void;
  mobileVelocityRef?: React.RefObject<VelocityVector>;
  onNearestChange: (object: InteractiveObjectConfig | null) => void;
  isSitting: boolean;
  sittingPosition: [number, number, number] | null;
  onSitBench: (pos: [number, number, number]) => void;
  onStandUp: () => void;
  onTouchWater?: () => void;
  onPickFlower?: (name: string, color: string) => void;
  onWaterPlant?: (potId: string, plantName: string) => void;
  onTriggerDiscovery?: (text: string) => void;
  actionState?: 'idle' | 'walk' | 'pick' | 'water' | 'sit' | 'touch_water';
  isFocusingBloom?: boolean;
  bloomPosition?: [number, number, number];
  playerPositionRef: React.RefObject<THREE.Vector3>;
}

export function GardenCanvas({
  profile,
  bloomState,
  onOpenChat,
  mobileVelocityRef,
  onNearestChange,
  isSitting,
  sittingPosition,
  onSitBench,
  onStandUp,
  onTouchWater,
  onPickFlower,
  onWaterPlant,
  onTriggerDiscovery,
  actionState = 'idle',
  isFocusingBloom = false,
  bloomPosition,
  playerPositionRef,
}: GardenCanvasProps) {
  const [interactiveObjects, setInteractiveObjects] = useState<InteractiveObjectConfig[]>([]);

  const handleRegisterObjects = useCallback((objects: InteractiveObjectConfig[]) => {
    setInteractiveObjects((prev) => {
      const existingIds = new Set(prev.map((o) => o.id));
      const fresh = objects.filter((o) => !existingIds.has(o.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, []);

  const handleRegisterSingleObject = useCallback((obj: InteractiveObjectConfig) => {
    setInteractiveObjects((prev) => {
      const exists = prev.some((o) => o.id === obj.id);
      return exists ? prev.map((o) => (o.id === obj.id ? obj : o)) : [...prev, obj];
    });
  }, []);

  return (
    <Canvas
      shadows={profile.shadowsEnabled}
      dpr={profile.pixelRatio}
      camera={{ fov: 58, near: 0.1, far: 220, position: [0, 3.2, 22] }}
      gl={{ antialias: profile.antialias, powerPreference: 'default' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <GardenScene
        profile={profile}
        bloomState={bloomState}
        onOpenChat={onOpenChat}
        onRegisterObjects={handleRegisterObjects}
        onRegisterSingleObject={handleRegisterSingleObject}
        onSitBench={onSitBench}
        onTouchWater={onTouchWater}
        onPickFlower={onPickFlower}
        onWaterPlant={onWaterPlant}
        onTriggerDiscovery={onTriggerDiscovery}
        playerPositionRef={playerPositionRef}
      />

      <Player
        positionRef={playerPositionRef}
        mobileVelocityRef={mobileVelocityRef}
        isSitting={isSitting}
        sittingPosition={sittingPosition}
        onStandUp={onStandUp}
        actionState={actionState}
        isFocusingBloom={isFocusingBloom}
        bloomPosition={bloomPosition}
      />

      <InteractionDetector
        playerPositionRef={playerPositionRef}
        objects={interactiveObjects}
        onNearestChange={onNearestChange}
      />
    </Canvas>
  );
}

