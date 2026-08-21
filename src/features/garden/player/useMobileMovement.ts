'use client';

// Hook: converts nipplejs joystick events to a velocity ref.
// The joystick mounts on a given DOM element after component mount.
// Destroyed on unmount to avoid memory leaks.

import { useEffect, useRef } from 'react';
import type { VelocityVector } from '../types/garden.types';
import { JOYSTICK_DEAD_ZONE } from '../constants/garden.constants';

export function useMobileMovement(
  containerRef: React.RefObject<HTMLDivElement | null>,
): React.RefObject<VelocityVector> {
  const velocityRef = useRef<VelocityVector>({ x: 0, z: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let joystick: import('nipplejs').JoystickManager | null = null;

    // Dynamic import so nipplejs is never loaded on desktop
    import('nipplejs').then((nipplejs) => {
      joystick = nipplejs.default.create({
        zone: container,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'rgba(255,255,255,0.4)',
        size: 80,
      });

      joystick.on('move', (_event, data) => {
        if (!data.force || data.force < JOYSTICK_DEAD_ZONE) {
          velocityRef.current = { x: 0, z: 0 };
          return;
        }

        const angle = data.angle.radian;
        // nipplejs angle: 0 = right, PI/2 = up. Convert to x/z:
        // forward in 3D is negative z, right is positive x.
        const force = Math.min(data.force, 1);
        velocityRef.current = {
          x: Math.cos(angle) * force,
          z: -Math.sin(angle) * force,
        };
      });

      joystick.on('end', () => {
        velocityRef.current = { x: 0, z: 0 };
      });
    });

    return () => {
      if (joystick) {
        joystick.destroy();
        joystick = null;
      }
    };
  }, [containerRef]);

  return velocityRef;
}
