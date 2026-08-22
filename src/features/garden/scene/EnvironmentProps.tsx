'use client';

// EnvironmentProps: Highly crafted stylized organic flora, multi-layered trees,
// tranquil botanical pond with soft ripples & reeds, weathered wooden bench,
// flower beds, lanterns, and interactive stations.
// Every object is grounded with getTerrainHeight to ensure zero z-fighting or clipping.

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';
import type { InteractiveObjectConfig } from '../types/garden.types';

// Tree Coordinates with different species/scales
const MATURE_TREES: [number, number, number][] = [
  [-8, -10, 1.25], // near pond
  [10, -8, 1.15],  // near bench
  [-14, 4, 1.35],
  [12, 12, 1.1],
  [-10, 16, 0.95],
  [6, -18, 1.3],
  [-16, -16, 1.45],
  [16, -2, 1.2],
];

const FLOWERING_TREES: [number, number, number][] = [
  [8, 4, 1.05],
  [-5, 8, 0.95],
  [-12, -6, 1.1],
  [14, -14, 1.0],
  [-2, 12, 0.9],
];

const POND_COORDS: [number, number] = [-6, -13];
const BENCH_COORDS: [number, number] = [8, -8];
const WATERING_CAN_COORDS: [number, number] = [6.5, -7];
const SEED_BED_COORDS: [number, number] = [2, 8];

interface EnvironmentPropsProps {
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
}

export function EnvironmentProps({ onRegisterObjects }: EnvironmentPropsProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const foliageGroupRef = useRef<THREE.Group>(null);

  const pondY = getTerrainHeight(POND_COORDS[0], POND_COORDS[1]) + 0.12;
  const benchY = getTerrainHeight(BENCH_COORDS[0], BENCH_COORDS[1]);
  const wateringCanY = getTerrainHeight(WATERING_CAN_COORDS[0], WATERING_CAN_COORDS[1]);
  const seedBedY = getTerrainHeight(SEED_BED_COORDS[0], SEED_BED_COORDS[1]);

  useEffect(() => {
    const objects: InteractiveObjectConfig[] = [
      {
        id: 'pond',
        type: 'pond',
        position: [POND_COORDS[0], pondY, POND_COORDS[1]],
        interactionRadius: 3.5,
        promptLabel: 'Listen to the gentle water ripples',
        onInteract: () => console.log('Interacted with Pond'),
      },
      {
        id: 'bench',
        type: 'bench',
        position: [BENCH_COORDS[0], benchY, BENCH_COORDS[1]],
        interactionRadius: 2.8,
        promptLabel: 'Sit down and take a mindful breath',
        onInteract: () => console.log('Interacted with Bench'),
      },
      {
        id: 'watering_can',
        type: 'watering_can',
        position: [WATERING_CAN_COORDS[0], wateringCanY, WATERING_CAN_COORDS[1]],
        interactionRadius: 2.2,
        promptLabel: 'Pick up vintage watering can',
        onInteract: () => console.log('Interacted with Watering Can'),
      },
      {
        id: 'flower_bed',
        type: 'flower',
        position: [SEED_BED_COORDS[0], seedBedY, SEED_BED_COORDS[1]],
        interactionRadius: 2.5,
        promptLabel: 'Tend to the blooming flower bed',
        onInteract: () => console.log('Interacted with Flower Bed'),
      },
    ];
    onRegisterObjects(objects);
  }, [onRegisterObjects, pondY, benchY, wateringCanY, seedBedY]);

  // Subtle natural water breathing motion
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = pondY + Math.sin(t * 1.5) * 0.015;
      waterRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
    }
    if (foliageGroupRef.current) {
      foliageGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.015;
    }
  });

  return (
    <group>
      {/* ===================== MATURE FOREST & SHADE TREES ===================== */}
      <group ref={foliageGroupRef}>
        {MATURE_TREES.map(([x, z, s], idx) => {
          const groundY = getTerrainHeight(x, z);
          return (
            <group key={`tree-${idx}`} position={[x, groundY, z]} scale={s}>
              {/* Trunk */}
              <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.25, 0.45, 2.8, 8]} />
                <meshStandardMaterial color="#4E3B2B" roughness={0.9} />
              </mesh>
              {/* Exposed Root flair */}
              <mesh position={[0.2, 0.2, 0.1]} rotation={[0.4, 0.3, -0.2]} castShadow>
                <cylinderGeometry args={[0.12, 0.25, 0.8, 6]} />
                <meshStandardMaterial color="#4E3B2B" roughness={0.9} />
              </mesh>
              {/* Layered Foliage Canopies */}
              <mesh position={[0, 2.8, 0]} castShadow>
                <dodecahedronGeometry args={[1.5, 1]} />
                <meshStandardMaterial color="#2D5A27" roughness={0.8} />
              </mesh>
              <mesh position={[0.4, 3.6, -0.2]} scale={0.8} castShadow>
                <dodecahedronGeometry args={[1.3, 1]} />
                <meshStandardMaterial color="#3E7535" roughness={0.8} />
              </mesh>
              <mesh position={[-0.3, 4.2, 0.2]} scale={0.65} castShadow>
                <dodecahedronGeometry args={[1.1, 1]} />
                <meshStandardMaterial color="#4E8C44" roughness={0.8} />
              </mesh>
            </group>
          );
        })}

        {/* ===================== FLOWERING BLOSSOM TREES ===================== */}
        {FLOWERING_TREES.map(([x, z, s], idx) => {
          const groundY = getTerrainHeight(x, z);
          return (
            <group key={`ftree-${idx}`} position={[x, groundY, z]} scale={s}>
              <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.35, 2.4, 8]} />
                <meshStandardMaterial color="#5A4332" roughness={0.9} />
              </mesh>
              <mesh position={[0, 2.4, 0]} castShadow>
                <dodecahedronGeometry args={[1.35, 1]} />
                <meshStandardMaterial color="#FFB5C5" roughness={0.75} />
              </mesh>
              <mesh position={[0.3, 3.1, 0.1]} scale={0.75} castShadow>
                <dodecahedronGeometry args={[1.15, 1]} />
                <meshStandardMaterial color="#FFCAD4" roughness={0.75} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ===================== BOTANICAL POND & SURROUNDINGS ===================== */}
      <group position={[POND_COORDS[0], 0, POND_COORDS[1]]}>
        {/* Deep Pond Basin Depression */}
        <mesh position={[0, pondY - 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.6, 24]} />
          <meshStandardMaterial color="#1E3F20" roughness={0.95} />
        </mesh>

        {/* Translucent Turquoise Water Surface */}
        <mesh ref={waterRef} position={[0, pondY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.4, 32]} />
          <meshStandardMaterial
            color="#2A9D8F"
            roughness={0.05}
            metalness={0.2}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Perimeter River Pebbles & Weathered Boulders */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const rad = 3.2 + Math.sin(i * 3) * 0.4;
          const rockX = Math.cos(angle) * rad;
          const rockZ = Math.sin(angle) * rad;
          const rockY = getTerrainHeight(POND_COORDS[0] + rockX, POND_COORDS[1] + rockZ);
          const scaleVal = 0.35 + (i % 3) * 0.18;
          return (
            <mesh
              key={`pond-rock-${i}`}
              position={[rockX, rockY + 0.05, rockZ]}
              scale={[scaleVal * 1.3, scaleVal * 0.7, scaleVal]}
              castShadow
              receiveShadow
            >
              <dodecahedronGeometry args={[0.5, 1]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#8D8C87' : '#73726D'} roughness={0.95} />
            </mesh>
          );
        })}

        {/* Floating Pond Lilypads */}
        <mesh position={[-0.8, pondY + 0.015, 0.6]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <circleGeometry args={[0.45, 16]} />
          <meshStandardMaterial color="#2D6A4F" roughness={0.7} />
        </mesh>
        <mesh position={[0.7, pondY + 0.015, -0.9]} rotation={[-Math.PI / 2, 0, 1.8]}>
          <circleGeometry args={[0.35, 16]} />
          <meshStandardMaterial color="#40916C" roughness={0.7} />
        </mesh>
        <mesh position={[1.2, pondY + 0.015, 0.4]} rotation={[-Math.PI / 2, 0, -0.4]}>
          <circleGeometry args={[0.4, 16]} />
          <meshStandardMaterial color="#2D6A4F" roughness={0.7} />
        </mesh>
      </group>

      {/* ===================== ARTISANAL WEATHERED WOOD BENCH ===================== */}
      <group position={[BENCH_COORDS[0], benchY, BENCH_COORDS[1]]} rotation={[0, -0.4, 0]}>
        {/* Slatted Seat */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.55]} />
          <meshStandardMaterial color="#6A4E38" roughness={0.88} />
        </mesh>
        {/* Bench Backrest */}
        <mesh position={[0, 0.75, -0.24]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.07]} />
          <meshStandardMaterial color="#6A4E38" roughness={0.88} />
        </mesh>
        {/* Legs & Iron Brackets */}
        <mesh position={[-0.7, 0.16, 0]} castShadow>
          <boxGeometry args={[0.1, 0.35, 0.48]} />
          <meshStandardMaterial color="#3A3836" roughness={0.9} />
        </mesh>
        <mesh position={[0.7, 0.16, 0]} castShadow>
          <boxGeometry args={[0.1, 0.35, 0.48]} />
          <meshStandardMaterial color="#3A3836" roughness={0.9} />
        </mesh>
      </group>

      {/* ===================== VINTAGE WATERING CAN PROP ===================== */}
      <group position={[WATERING_CAN_COORDS[0], wateringCanY, WATERING_CAN_COORDS[1]]} scale={0.75}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.35, 12]} />
          <meshStandardMaterial color="#52B788" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.22, 0.3, 0]} rotation={[0, 0, -0.6]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#52B788" roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* ===================== JAPANESE STONE LANTERN ===================== */}
      {(() => {
        const lanX = -2;
        const lanZ = -6;
        const lanY = getTerrainHeight(lanX, lanZ);
        return (
          <group position={[lanX, lanY, lanZ]} scale={0.7} rotation={[0, 0.3, 0]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 0.4, 6]} />
              <meshStandardMaterial color="#7D7C76" roughness={0.92} />
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshStandardMaterial color="#7D7C76" roughness={0.92} />
            </mesh>
            {/* Soft Warm Lantern Glow */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.26, 0.26, 0.26]} />
              <meshStandardMaterial color="#FFE8A3" emissive="#FFE8A3" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, 0.95, 0]} castShadow>
              <coneGeometry args={[0.65, 0.3, 6]} />
              <meshStandardMaterial color="#6E6D68" roughness={0.92} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
}
