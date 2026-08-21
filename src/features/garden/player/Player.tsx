'use client';

// Player: the movable character in the Garden.
// Position lives in a ref (not state) so useFrame updates never cause React re-renders.
// The capsule mesh is a placeholder. Phase 2 replaces it with Bloom 3D.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CapsuleGeometry } from 'three';
import {
  PLAYER_SPEED,
  PLAYER_CAPSULE_RADIUS,
  PLAYER_CAPSULE_HEIGHT,
  TERRAIN_SIZE,
} from '../constants/garden.constants';
import { usePlayerMovement } from './usePlayerMovement';
import { useFollowCamera } from './useFollowCamera';
import type { VelocityVector } from '../types/garden.types';

interface PlayerProps {
  positionRef: React.RefObject<THREE.Vector3>;
  mobileVelocityRef?: React.RefObject<VelocityVector>;
}

const HALF_TERRAIN = TERRAIN_SIZE / 2 - 1;

export function Player({ positionRef, mobileVelocityRef }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const keyboardVelocityRef = usePlayerMovement();

  useFollowCamera(positionRef);

  useFrame((_state, delta) => {
    const keyVel = keyboardVelocityRef.current;
    const mobileVel = mobileVelocityRef?.current;

    // Combine keyboard and joystick (one source is non-zero at a time)
    let vx = keyVel.x;
    let vz = keyVel.z;

    if (mobileVel && (mobileVel.x !== 0 || mobileVel.z !== 0)) {
      vx = mobileVel.x;
      vz = mobileVel.z;
    }

    const speed = PLAYER_SPEED * delta;
    const pos = positionRef.current;

    pos.x = THREE.MathUtils.clamp(pos.x + vx * speed, -HALF_TERRAIN, HALF_TERRAIN);
    pos.z = THREE.MathUtils.clamp(pos.z + vz * speed, -HALF_TERRAIN, HALF_TERRAIN);

    if (meshRef.current) {
      meshRef.current.position.copy(pos);

      // Face the direction of movement
      if (vx !== 0 || vz !== 0) {
        const angle = Math.atan2(vx, vz);
        meshRef.current.rotation.y = angle;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, PLAYER_CAPSULE_RADIUS + PLAYER_CAPSULE_HEIGHT / 2, 0]} castShadow>
      {/* Placeholder capsule — replaced by Bloom 3D in Phase 2 */}
      <capsuleGeometry args={[PLAYER_CAPSULE_RADIUS, PLAYER_CAPSULE_HEIGHT, 4, 8]} />
      <meshStandardMaterial color="#7EC8A4" opacity={0.6} transparent />
    </mesh>
  );
}
