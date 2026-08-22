'use client';

// Atmosphere: Layered environmental particle systems:
// 1. Drifting golden pollen dust
// 2. Falling cherry blossom / flower petals
// 3. Bioluminescent forest fireflies around Pine Grove & Bloom's Haven

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereProps {
  particleCount?: number;
}

export function Atmosphere({ particleCount = 45 }: AtmosphereProps) {
  const pollenRef = useRef<THREE.Points>(null);
  const petalsRef = useRef<THREE.Points>(null);
  const firefliesRef = useRef<THREE.Points>(null);

  // 1. Golden Pollen
  const [pollenPositions, pollenPhases, pollenSpeeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);
    const sp = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 38;
      pos[i * 3 + 1] = 0.5 + Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 38;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.2 + Math.random() * 0.4;
    }
    return [pos, ph, sp];
  }, [particleCount]);

  // 2. Falling Blossom Petals
  const [petalPositions, petalRotations, petalSpeeds] = useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);
    const rot = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = 1.0 + Math.random() * 5.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32;
      rot[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.4 + Math.random() * 0.5;
    }
    return [pos, rot, sp];
  }, []);

  // 3. Fireflies around Grove and Haven
  const fireflyPositions = useMemo(() => {
    const count = 16;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const isGrove = i < 8;
      const centerX = isGrove ? 12 : 2.2;
      const centerZ = isGrove ? -11 : -2.2;
      pos[i * 3 + 0] = centerX + (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = 0.6 + Math.random() * 2.5;
      pos[i * 3 + 2] = centerZ + (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Pollen gentle drifting
    if (pollenRef.current) {
      const geo = pollenRef.current.geometry;
      const arr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 0] += Math.sin(time * pollenSpeeds[i] + pollenPhases[i]) * 0.007;
        arr[i * 3 + 1] += Math.cos(time * pollenSpeeds[i] * 0.5 + pollenPhases[i]) * 0.003;
        arr[i * 3 + 2] += Math.cos(time * pollenSpeeds[i] + pollenPhases[i]) * 0.007;

        if (arr[i * 3 + 1] < 0.2) arr[i * 3 + 1] = 6.0;
        if (arr[i * 3 + 1] > 6.5) arr[i * 3 + 1] = 0.5;
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Petals gently falling
    if (petalsRef.current) {
      const geo = petalsRef.current.geometry;
      const arr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < 30; i++) {
        arr[i * 3 + 0] += Math.sin(time * 1.2 + petalRotations[i]) * 0.012;
        arr[i * 3 + 1] -= petalSpeeds[i] * 0.018;
        arr[i * 3 + 2] += Math.cos(time * 0.8 + petalRotations[i]) * 0.01;

        if (arr[i * 3 + 1] < 0.1) {
          arr[i * 3 + 1] = 5.5;
          arr[i * 3 + 0] = (Math.random() - 0.5) * 30;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }

    // Fireflies undulating glow & bob
    if (firefliesRef.current) {
      const geo = firefliesRef.current.geometry;
      const arr = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < 16; i++) {
        arr[i * 3 + 1] += Math.sin(time * 2.5 + i) * 0.005;
        arr[i * 3 + 0] += Math.cos(time * 1.5 + i) * 0.004;
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Golden Pollen */}
      <points ref={pollenRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pollenPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color="#FFE8B2"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Blossom Petals */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[petalPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#FFB5C5"
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>

      {/* Pine Grove & Haven Fireflies */}
      <points ref={firefliesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fireflyPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#90E0EF"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

