'use client';

// Hook: proximity based interaction detection.
// Runs inside useFrame. Compares player position to each interactive object.
// Only fires onNearestChange when the nearest object actually changes,
// so UI re-renders are rare (not every frame).

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InteractiveObjectConfig } from '../types/garden.types';
import { INTERACTION_RADIUS } from '../constants/garden.constants';

const tempVec = new THREE.Vector3();

export function useInteractionSystem(
  playerPositionRef: React.RefObject<THREE.Vector3>,
  objects: InteractiveObjectConfig[],
  onNearestChange: (object: InteractiveObjectConfig | null) => void,
): void {
  const lastNearestIdRef = useRef<string | null>(null);

  useFrame(() => {
    const playerPos = playerPositionRef.current;
    if (!playerPos) return;

    let nearestObject: InteractiveObjectConfig | null = null;
    let nearestDistanceSq = INTERACTION_RADIUS * INTERACTION_RADIUS;

    for (const obj of objects) {
      tempVec.set(...obj.position);
      const distanceSq = playerPos.distanceToSquared(tempVec);
      if (distanceSq <= nearestDistanceSq) {
        nearestDistanceSq = distanceSq;
        nearestObject = obj;
      }
    }

    const newId = nearestObject?.id ?? null;
    if (newId !== lastNearestIdRef.current) {
      lastNearestIdRef.current = newId;
      onNearestChange(nearestObject);
    }
  });
}
