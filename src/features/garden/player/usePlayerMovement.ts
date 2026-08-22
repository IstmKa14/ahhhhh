'use client';

// Hook: converts keyboard input to a velocity ref.
// Uses a ref (not state) so velocity changes never trigger React re-renders.
// WASD and arrow key support.

import { useEffect, useRef } from 'react';
import type { VelocityVector } from '../types/garden.types';

const KEY_MAP: Record<string, keyof VelocityVector> = {};

export function usePlayerMovement(): React.RefObject<VelocityVector> {
  const velocityRef = useRef<VelocityVector>({ x: 0, z: 0 });
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      keysRef.current.add(e.code);
      updateVelocity();
    }

    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.code);
      updateVelocity();
    }

    function updateVelocity() {
      const keys = keysRef.current;
      let x = 0;
      let z = 0;

      if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
      if (keys.has('KeyW') || keys.has('ArrowUp')) z -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) z += 1;

      // Normalize diagonal movement so speed is consistent
      if (x !== 0 && z !== 0) {
        const len = Math.sqrt(x * x + z * z);
        x /= len;
        z /= len;
      }

      velocityRef.current = { x, z };
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
