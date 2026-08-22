'use client';

// Third-Person Orbit Camera with Damping, Pitch/Yaw Control, Terrain Clamping,
// and Focus Modes for Sitting Meditation and Bloom Conversations.

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';

interface OrbitCameraOptions {
  isSitting?: boolean;
  isFocusingBloom?: boolean;
  bloomPosition?: [number, number, number];
}

// Shared camera azimuth angle ref so movement systems can compute camera-relative directions
export const cameraAzimuthRef = { current: 0 };

export function useFollowCamera(
  playerPositionRef: React.RefObject<THREE.Vector3>,
  options: OrbitCameraOptions = {}
): void {
  const { isSitting = false, isFocusingBloom = false, bloomPosition } = options;
  const { gl } = useThree();

  // Spherical Orbit State
  const azimuthRef = useRef(0); // Horizontal angle (radians)
  const polarRef = useRef(Math.PI / 4.2); // Vertical angle (radians)
  const distanceRef = useRef(5.6); // Distance behind player
  const targetDistanceRef = useRef(5.6);
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });

  // Vectors for frame math
  const desiredPos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  // Mouse / Pointer Event Listeners for Orbit & Zoom
  useEffect(() => {
    const domElement = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      // Allow orbit on primary click or right-click
      if (e.button === 0 || e.button === 2) {
        isDraggingRef.current = true;
        previousPointerRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousPointerRef.current.x;
      const deltaY = e.clientY - previousPointerRef.current.y;

      previousPointerRef.current = { x: e.clientX, y: e.clientY };

      const rotateSpeed = 0.0055;
      azimuthRef.current -= deltaX * rotateSpeed;
      cameraAzimuthRef.current = azimuthRef.current;

      // Pitch angle clamping (prevents underground camera and top-down flip)
      polarRef.current = THREE.MathUtils.clamp(
        polarRef.current + deltaY * rotateSpeed,
        0.18,
        Math.PI / 2.35
      );
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      const zoomSpeed = 0.0025;
      targetDistanceRef.current = THREE.MathUtils.clamp(
        targetDistanceRef.current + e.deltaY * zoomSpeed,
        3.2,
        9.5
      );
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
    };
  }, [gl]);

  useFrame(({ camera }) => {
    const playerPos = playerPositionRef.current;
    if (!playerPos) return;

    // Smooth zoom damping
    distanceRef.current = THREE.MathUtils.lerp(distanceRef.current, targetDistanceRef.current, 0.1);

    if (isFocusingBloom && bloomPosition) {
      // Bloom conversation framing: position camera between player and Bloom with gentle cinematic side angle
      const midX = (playerPos.x + bloomPosition[0]) / 2;
      const midZ = (playerPos.z + bloomPosition[2]) / 2;
      const midY = (playerPos.y + bloomPosition[1]) / 2;

      desiredPos.current.set(
        midX + Math.sin(azimuthRef.current + 0.5) * 3.8,
        midY + 1.6,
        midZ + Math.cos(azimuthRef.current + 0.5) * 3.8
      );

      camera.position.lerp(desiredPos.current, 0.06);
      lookTarget.current.set(midX, midY + 0.9, midZ);
      camera.lookAt(lookTarget.current);
      return;
    }

    if (isSitting) {
      // Contemplative seated meditation framing
      desiredPos.current.set(
        playerPos.x + Math.sin(azimuthRef.current) * 3.8,
        playerPos.y + 1.5,
        playerPos.z + Math.cos(azimuthRef.current) * 3.8
      );
      camera.position.lerp(desiredPos.current, 0.05);

      lookTarget.current.set(playerPos.x, playerPos.y + 0.85, playerPos.z);
      camera.lookAt(lookTarget.current);
      return;
    }

    // Standard 3rd Person Spherical Orbit
    const dist = distanceRef.current;
    const polar = polarRef.current;
    const azimuth = azimuthRef.current;

    const offsetX = dist * Math.sin(polar) * Math.sin(azimuth);
    const offsetY = dist * Math.cos(polar);
    const offsetZ = dist * Math.sin(polar) * Math.cos(azimuth);

    const targetX = playerPos.x + offsetX;
    const targetZ = playerPos.z + offsetZ;
    let targetY = playerPos.y + 0.9 + offsetY;

    // Ground & Terrain collision check for camera (prevents camera clipping underground)
    const groundY = getTerrainHeight(targetX, targetZ) + 0.65;
    if (targetY < groundY) {
      targetY = groundY;
    }

    desiredPos.current.set(targetX, targetY, targetZ);
    camera.position.lerp(desiredPos.current, 0.1);

    lookTarget.current.set(playerPos.x, playerPos.y + 1.15, playerPos.z);
    camera.lookAt(lookTarget.current);
  });
}


