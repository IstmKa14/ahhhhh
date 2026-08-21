'use client';

// Player: the movable character in the Garden featuring the redesigned Bloom companion.
// Uses optimized ref tracking for 60fps movement and smooth rotation physics.

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  PLAYER_SPEED,
  TERRAIN_SIZE,
} from '../constants/garden.constants';
import { usePlayerMovement } from './usePlayerMovement';
import { useFollowCamera } from './useFollowCamera';
import { BloomCharacter } from './BloomCharacter';
import type { VelocityVector } from '../types/garden.types';

interface PlayerProps {
  positionRef: React.RefObject<THREE.Vector3>;
  mobileVelocityRef?: React.RefObject<VelocityVector>;
}

const HALF_TERRAIN = TERRAIN_SIZE / 2 - 2;

export function Player({ positionRef, mobileVelocityRef }: PlayerProps) {
  const meshRef = useRef<THREE.Group>(null);
  const keyboardVelocityRef = usePlayerMovement();
  const [isMoving, setIsMoving] = useState(false);

  useFollowCamera(positionRef);

  useFrame((_state, delta) => {
    const keyVel = keyboardVelocityRef.current;
    const mobileVel = mobileVelocityRef?.current;

    let vx = keyVel.x;
    let vz = keyVel.z;

    if (mobileVel && (mobileVel.x !== 0 || mobileVel.z !== 0)) {
      vx = mobileVel.x;
      vz = mobileVel.z;
    }

    const movingNow = vx !== 0 || vz !== 0;
    if (movingNow !== isMoving) {
      setIsMoving(movingNow);
    }

    const speed = PLAYER_SPEED * delta;
    const pos = positionRef.current;

    pos.x = THREE.MathUtils.clamp(pos.x + vx * speed, -HALF_TERRAIN, HALF_TERRAIN);
    pos.z = THREE.MathUtils.clamp(pos.z + vz * speed, -HALF_TERRAIN, HALF_TERRAIN);

    // Elevation adjustment based on terrain undulation
    const x = pos.x;
    const z = pos.z;
    const dist = Math.sqrt(x * x + z * z);
    const hillNoise1 = Math.sin(x * 0.1) * Math.cos(z * 0.08) * 0.8;
    const hillNoise2 = Math.cos(x * 0.05 + 1.2) * Math.sin(z * 0.06) * 1.2;
    const pathDist = Math.abs(x - Math.sin(z * 0.15) * 4);
    const pathDampen = Math.min(1, Math.max(0, (pathDist - 1.5) / 4));
    const perimeterRise = Math.pow(Math.max(0, (dist - 18) / 12), 2) * 2.5;
    pos.y = (hillNoise1 + hillNoise2) * pathDampen * 0.4 + perimeterRise;

    if (meshRef.current) {
      meshRef.current.position.copy(pos);

      // Smoothly rotate towards movement vector
      if (movingNow) {
        const targetAngle = Math.atan2(vx, vz);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetAngle,
          0.15
        );
      }
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <BloomCharacter isMoving={isMoving} />
    </group>
  );
}
