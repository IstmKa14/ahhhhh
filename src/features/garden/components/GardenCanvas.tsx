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
import type { InteractiveObjectConfig, QualityProfile, VelocityVector } from '../types/garden.types';

interface GardenCanvasProps {
  profile: QualityProfile;
  mobileVelocityRef?: React.RefObject<VelocityVector>;
  onNearestChange: (object: InteractiveObjectConfig | null) => void;
}

export function GardenCanvas({
  profile,
  mobileVelocityRef,
  onNearestChange,
}: GardenCanvasProps) {
  const playerPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [interactiveObjects, setInteractiveObjects] = useState<InteractiveObjectConfig[]>([]);

  const handleRegisterObjects = useCallback((objects: InteractiveObjectConfig[]) => {
    setInteractiveObjects((prev) => {
      // Merge new objects, avoid duplicates by id
      const existingIds = new Set(prev.map((o) => o.id));
      const fresh = objects.filter((o) => !existingIds.has(o.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, []);

  return (
    <Canvas
      shadows={profile.shadowsEnabled}
      dpr={profile.pixelRatio}
      camera={{ fov: 60, near: 0.1, far: 200, position: [0, 3, 6] }}
      gl={{ antialias: profile.antialias, powerPreference: 'default' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <GardenScene profile={profile} onRegisterObjects={handleRegisterObjects} />

      <Player
        positionRef={playerPositionRef}
        mobileVelocityRef={mobileVelocityRef}
      />

      <InteractionDetector
        playerPositionRef={playerPositionRef}
        objects={interactiveObjects}
        onNearestChange={onNearestChange}
      />
    </Canvas>
  );
}
