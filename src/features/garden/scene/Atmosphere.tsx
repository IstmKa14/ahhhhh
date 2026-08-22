'use client';

// Atmosphere: Environmental Particles (floating golden pollen, drifting petals)
// and soft subtle swaying breezes. Optimized single BufferGeometry with point rendering.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereProps {
  particleCount?: number;
}

export function Atmosphere({ particleCount = 40 }: AtmosphereProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);
    const sp = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 35; // x
      pos[i * 3 + 1] = 0.5 + Math.random() * 6;     // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35; // z
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.2 + Math.random() * 0.4;
    }
    return [pos, ph, sp];
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // Gentle sway and drift
      array[i * 3 + 0] += Math.sin(time * speeds[i] + phases[i]) * 0.006;
      array[i * 3 + 1] += Math.cos(time * speeds[i] * 0.5 + phases[i]) * 0.003;
      array[i * 3 + 2] += Math.cos(time * speeds[i] + phases[i]) * 0.006;

      // Wrap around bounds
      if (array[i * 3 + 1] < 0.2) array[i * 3 + 1] = 6.0;
      if (array[i * 3 + 1] > 6.5) array[i * 3 + 1] = 0.5;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#FDE8C0" // Warm golden pollen
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
