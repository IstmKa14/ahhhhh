'use client';

// Player: Movable user character with camera-relative movement,
// smooth rotation interpolation, obstacle collision resolution, and animation states.

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYER_SPEED, TERRAIN_SIZE } from '../constants/garden.constants';
import { usePlayerMovement } from './usePlayerMovement';
import { useFollowCamera, cameraAzimuthRef } from './useFollowCamera';
import { PlayerCharacter, type PlayerActionState } from './PlayerCharacter';
import { getTerrainHeight } from '../utils/terrainMath';
import { resolvePlayerCollisions } from '../systems/CollisionSystem';
import type { VelocityVector } from '../types/garden.types';

interface PlayerProps {
  positionRef: React.RefObject<THREE.Vector3>;
  mobileVelocityRef?: React.RefObject<VelocityVector>;
  isSitting?: boolean;
  sittingPosition?: [number, number, number] | null;
  onStandUp?: () => void;
  actionState?: PlayerActionState;
  isFocusingBloom?: boolean;
  bloomPosition?: [number, number, number];
}

const HALF_TERRAIN = TERRAIN_SIZE / 2 - 4;

export function Player({
  positionRef,
  mobileVelocityRef,
  isSitting = false,
  sittingPosition,
  onStandUp,
  actionState = 'idle',
  isFocusingBloom = false,
  bloomPosition,
}: PlayerProps) {
  const meshRef = useRef<THREE.Group>(null);
  const keyboardVelocityRef = usePlayerMovement();
  const [isMoving, setIsMoving] = useState(false);
  const currentVelocity = useRef({ x: 0, z: 0 });

  useFollowCamera(positionRef, {
    isSitting,
    isFocusingBloom,
    bloomPosition,
  });

  // Position onto bench seat when sitting
  useEffect(() => {
    if (isSitting && sittingPosition && positionRef.current) {
      positionRef.current.set(sittingPosition[0], sittingPosition[1], sittingPosition[2]);
      if (meshRef.current) {
        meshRef.current.position.set(sittingPosition[0], sittingPosition[1], sittingPosition[2]);
        meshRef.current.rotation.y = -0.4;
      }
    }
  }, [isSitting, sittingPosition, positionRef]);

  useFrame((_state, delta) => {
    const keyVel = keyboardVelocityRef.current;
    const mobileVel = mobileVelocityRef?.current;

    let targetVx = keyVel.x;
    let targetVz = keyVel.z;

    // Mobile joystick input is camera-relative
    if (mobileVel && (mobileVel.x !== 0 || mobileVel.z !== 0)) {
      const theta = cameraAzimuthRef.current;
      const camFwdX = -Math.sin(theta);
      const camFwdZ = -Math.cos(theta);
      const camRightX = Math.cos(theta);
      const camRightZ = -Math.sin(theta);

      targetVx = -mobileVel.z * camFwdX + mobileVel.x * camRightX;
      targetVz = -mobileVel.z * camFwdZ + mobileVel.x * camRightZ;
    }

    const hasInput = targetVx !== 0 || targetVz !== 0;

    // Auto stand up if player walks while sitting
    if (hasInput && isSitting && onStandUp) {
      onStandUp();
    }

    if (isSitting || actionState === 'pick' || actionState === 'water') {
      setIsMoving(false);
      currentVelocity.current.x = 0;
      currentVelocity.current.z = 0;
      return;
    }

    // Smooth movement inertia / acceleration & deceleration
    const accel = 12.0 * delta;
    currentVelocity.current.x = THREE.MathUtils.lerp(currentVelocity.current.x, targetVx, accel);
    currentVelocity.current.z = THREE.MathUtils.lerp(currentVelocity.current.z, targetVz, accel);

    const speedSq = currentVelocity.current.x ** 2 + currentVelocity.current.z ** 2;
    const movingNow = speedSq > 0.005;

    if (movingNow !== isMoving) {
      setIsMoving(movingNow);
    }

    const pos = positionRef.current;
    if (!pos) return;

    const moveStep = PLAYER_SPEED * delta;
    let nextX = pos.x + currentVelocity.current.x * moveStep;
    let nextZ = pos.z + currentVelocity.current.z * moveStep;

    // Clamp terrain boundaries
    nextX = THREE.MathUtils.clamp(nextX, -HALF_TERRAIN, HALF_TERRAIN);
    nextZ = THREE.MathUtils.clamp(nextZ, -HALF_TERRAIN, HALF_TERRAIN);

    // Resolve static obstacle collisions (trees, tables, lanterns, benches)
    const resolved = resolvePlayerCollisions(nextX, nextZ);
    pos.x = resolved.x;
    pos.z = resolved.z;

    // Ground height tracking
    pos.y = getTerrainHeight(pos.x, pos.z);

    if (meshRef.current) {
      meshRef.current.position.copy(pos);

      // Smoothly interpolate rotation angle toward movement vector
      if (movingNow) {
        const targetAngle = Math.atan2(currentVelocity.current.x, currentVelocity.current.z);
        // Shortest angle rotation interpolation
        let diff = targetAngle - meshRef.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        meshRef.current.rotation.y += diff * THREE.MathUtils.clamp(14.0 * delta, 0, 1);
      }
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 16]}>
      <PlayerCharacter
        isMoving={isMoving}
        isSitting={isSitting}
        actionState={actionState}
      />
    </group>
  );
}


