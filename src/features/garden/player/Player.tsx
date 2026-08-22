'use client';

// Player: the movable character in the Garden featuring the redesigned Bloom companion.
// Uses exact analytical ground height sampling so feet never float or sink into slopes.

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
import { getTerrainHeight } from '../utils/terrainMath';
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

    // Exact ground detection via analytical terrain math
    pos.y = getTerrainHeight(pos.x, pos.z);

    if (meshRef.current) {
      meshRef.current.position.copy(pos);

      // Smoothly rotate towards movement vector
      if (movingNow) {
        const targetAngle = Math.atan2(vx, vz);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetAngle,
          0.18
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
