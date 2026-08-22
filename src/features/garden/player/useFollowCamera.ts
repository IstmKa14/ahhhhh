'use client';

// Hook: lerp spring camera that follows the player position ref.
// Runs inside useFrame so camera updates never trigger React re-renders.
// The lag factor controls how far behind the camera trails the player.

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CAMERA_HEIGHT_OFFSET,
  CAMERA_DISTANCE,
  CAMERA_LERP_FACTOR,
} from '../constants/garden.constants';

const targetPosition = new THREE.Vector3();
const lookAtTarget = new THREE.Vector3();

export function useFollowCamera(
  playerPositionRef: React.RefObject<THREE.Vector3>,
): void {
  useFrame(({ camera }) => {
    const pos = playerPositionRef.current;
    if (!pos) return;

    targetPosition.set(
      pos.x,
      pos.y + CAMERA_HEIGHT_OFFSET,
      pos.z + CAMERA_DISTANCE,
    );

    camera.position.lerp(targetPosition, CAMERA_LERP_FACTOR);

    lookAtTarget.set(pos.x, pos.y + 1, pos.z);
    camera.lookAt(lookAtTarget);
  });
}
