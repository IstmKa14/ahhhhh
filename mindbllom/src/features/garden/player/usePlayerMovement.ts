'use client';

// Hook: converts keyboard input to camera-relative velocity vector.
// Reads cameraAzimuthRef dynamically so movement is always relative to current orbit view.

import { useEffect, useRef } from 'react';
import type { VelocityVector } from '../types/garden.types';
import { cameraAzimuthRef } from './useFollowCamera';

export function usePlayerMovement(): React.RefObject<VelocityVector> {
  const velocityRef = useRef<VelocityVector>({ x: 0, z: 0 });
  const rawInputRef = useRef({ forward: 0, right: 0 });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'KeyW' || e.code === 'ArrowUp') rawInputRef.current.forward = 1;
      else if (e.code === 'KeyS' || e.code === 'ArrowDown') rawInputRef.current.forward = -1;

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') rawInputRef.current.right = -1;
      else if (e.code === 'KeyD' || e.code === 'ArrowRight') rawInputRef.current.right = 1;

      updateCameraRelativeVelocity();
    }

    function onKeyUp(e: KeyboardEvent) {
      if (
        (e.code === 'KeyW' || e.code === 'ArrowUp') && rawInputRef.current.forward === 1 ||
        (e.code === 'KeyS' || e.code === 'ArrowDown') && rawInputRef.current.forward === -1
      ) {
        rawInputRef.current.forward = 0;
      }

      if (
        (e.code === 'KeyA' || e.code === 'ArrowLeft') && rawInputRef.current.right === -1 ||
        (e.code === 'KeyD' || e.code === 'ArrowRight') && rawInputRef.current.right === 1
      ) {
        rawInputRef.current.right = 0;
      }

      updateCameraRelativeVelocity();
    }

    function updateCameraRelativeVelocity() {
      const fwd = rawInputRef.current.forward;
      const right = rawInputRef.current.right;

      if (fwd === 0 && right === 0) {
        velocityRef.current = { x: 0, z: 0 };
        return;
      }

      // Camera horizontal azimuth angle
      const theta = cameraAzimuthRef.current;
      // Camera forward vector on XZ plane: [-sin(theta), -cos(theta)]
      const camFwdX = -Math.sin(theta);
      const camFwdZ = -Math.cos(theta);
      // Camera right vector on XZ plane: [cos(theta), -sin(theta)]
      const camRightX = Math.cos(theta);
      const camRightZ = -Math.sin(theta);

      let vx = fwd * camFwdX + right * camRightX;
      let vz = fwd * camFwdZ + right * camRightZ;

      const len = Math.sqrt(vx * vx + vz * vz);
      if (len > 0) {
        vx /= len;
        vz /= len;
      }

      velocityRef.current = { x: vx, z: vz };
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return velocityRef;
}

