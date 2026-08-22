'use client';

// MobileControls: virtual joystick for touch devices.
// Mounts nipplejs on the container element after component mount.
// Hidden entirely on non-touch devices via conditional render in GardenUI.
// The velocityRef is created here and passed to GardenCanvas via GardenExperience.

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { VelocityVector } from '../types/garden.types';
import { JOYSTICK_DEAD_ZONE } from '../constants/garden.constants';

// Inline type for nipplejs event data so we avoid namespace import issues.
// The actual event data shape is JoystickEventData from nipplejs/dist/index.d.ts.
interface NippleEventData {
  force: number;
  angle: { radian: number; degree: number };
  direction?: { x: string; y: string; angle: string };
  position: { x: number; y: number };
  distance: number;
}

export interface MobileControlsHandle {
  velocityRef: React.RefObject<VelocityVector>;
}

export const MobileControls = forwardRef<MobileControlsHandle, object>(
  function MobileControls(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const velocityRef = useRef<VelocityVector>({ x: 0, z: 0 });

    useImperativeHandle(ref, () => ({ velocityRef }), []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let joystick: any = null;

      import('nipplejs').then((nipplejs) => {
        joystick = nipplejs.default.create({
          zone: container,
          mode: 'static',
          position: { left: '50%', top: '50%' },
          color: 'rgba(255,255,255,0.4)',
          size: 80,
        });

        joystick.on('move', (_event: unknown, data: NippleEventData) => {
          if (!data.force || data.force < JOYSTICK_DEAD_ZONE) {
            velocityRef.current = { x: 0, z: 0 };
            return;
          }

          const angle = data.angle.radian;
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
    }, []);

    return (
      <div
        className="absolute bottom-6 left-6 pointer-events-auto touch-none"
        aria-hidden="true"
      >
        <div
          ref={containerRef}
          className="relative w-24 h-24 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
        />
      </div>
    );
  },
);
