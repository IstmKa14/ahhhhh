'use client';

// InteractionDetector: an R3F component that runs the proximity system.
// It wraps useInteractionSystem and bridges from the Three.js world
// to the React UI layer via the onNearestChange callback.

import * as THREE from 'three';
import type { InteractiveObjectConfig } from '../types/garden.types';
import { useInteractionSystem } from './useInteractionSystem';

interface InteractionDetectorProps {
  playerPositionRef: React.RefObject<THREE.Vector3>;
  objects: InteractiveObjectConfig[];
  onNearestChange: (object: InteractiveObjectConfig | null) => void;
}

export function InteractionDetector({
  playerPositionRef,
  objects,
  onNearestChange,
}: InteractionDetectorProps) {
  useInteractionSystem(playerPositionRef, objects, onNearestChange);
  return null; // renders nothing, runs logic only
}
