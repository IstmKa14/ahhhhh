'use client';

// EnvironmentProps: Highly crafted stylized organic flora, multi-layered trees,
// tranquil botanical pond with soft ripples & reeds, weathered wooden bench,
// flower beds, lanterns, and interactive stations.

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { InteractiveObjectConfig } from '../types/garden.types';

// Tree Coordinates with different species/scales
const MATURE_TREES: [number, number, number, number][] = [
  [-8, 0, -10, 1.2], // near pond
  [10, 0, -8, 1.1],  // near bench
  [-14, 0, 4, 1.3],
  [12, 0, 12, 1.0],
  [-10, 0, 16, 0.9],
  [6, 0, -18, 1.25],
  [-16, 0, -16, 1.4],
  [16, 0, -2, 1.15],
];

const FLOWERING_TREES: [number, number, number, number][] = [
  [8, 0, 4, 0.95],
  [-5, 0, 8, 0.85],
  [-12, 0, -6, 1.0],
  [14, 0, -14, 0.9],
];

// Flower Cluster Positions
const FLOWER_CLUSTERS = [
  { pos: [-3, 0.05, -3], color: '#E8C5C8' }, // Dusty Pink
  { pos: [2, 0.05, -5], color: '#F4ECE1' },  // Soft Cream White
  { pos: [-6, 0.05, -8], color: '#C8B6DB' }, // Muted Lavender
  { pos: [5, 0.05, 3], color: '#FCE7A1' },   // Pale Buttercup
  { pos: [-4, 0.05, 6], color: '#E8C5C8' },
  { pos: [7, 0.05, -12], color: '#F4ECE1' },
  { pos: [-2, 0.05, -14], color: '#C8B6DB' },
];

const POND_POSITION: [number, number, number] = [-6, 0.08, -13];
const BENCH_POSITION: [number, number, number] = [8, 0.35, -8];
const WATERING_CAN_POS: [number, number, number] = [6.5, 0.1, -7];
const SEED_BED_POS: [number, number, number] = [2, 0.1, 8];

interface EnvironmentPropsProps {
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
}

export function EnvironmentProps({ onRegisterObjects }: EnvironmentPropsProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const foliageGroupRef = useRef<THREE.Group>(null);

  // Register all interactive storytelling checkpoints
  useEffect(() => {
    const objects: InteractiveObjectConfig[] = [
      {
        id: 'pond',
        type: 'pond',
        position: POND_POSITION,
        interactionRadius: 3.5,
        promptLabel: 'Listen to the gentle water ripples',
        onInteract: () => console.log('Interacted with Pond'),
      },
      {
        id: 'bench',
        type: 'bench',
        position: BENCH_POSITION,
        interactionRadius: 2.8,
        promptLabel: 'Sit down and take a mindful breath',
        onInteract: () => console.log('Interacted with Bench'),
      },
      {
        id: 'watering_can',
        type: 'watering_can',
        position: WATERING_CAN_POS,
        interactionRadius: 2.2,
        promptLabel: 'Pick up vintage watering can',
        onInteract: () => console.log('Interacted with Watering Can'),
      },
      {
        id: 'flower_bed',
        type: 'flower',
        position: SEED_BED_POS,
        interactionRadius: 2.5,
        promptLabel: 'Tend to the blooming lavender bed',
        onInteract: () => console.log('Interacted with Flower Bed'),
      },
    ];
    onRegisterObjects(objects);
  }, [onRegisterObjects]);

  // Subtle natural water breathing motion
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = POND_POSITION[1] + Math.sin(t * 1.5) * 0.015;
      waterRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
    }
    if (foliageGroupRef.current) {
      foliageGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.015;
    }
  });

  return (
    <group>
      {/* ===================== MATURE FOREST TREES ===================== */}
      <group ref={foliageGroupRef}>
        {MATURE_TREES.map(([x, y, z, s], idx) => (
          <group key={`tree-${idx}`} position={[x, y, z]} scale={s}>
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
              <meshStandardMaterial color="#37523B" roughness={0.8} />
            </mesh>
            <mesh position={[0.4, 3.6, -0.2]} scale={0.8} castShadow>
              <dodecahedronGeometry args={[1.3, 1]} />
              <meshStandardMaterial color="#47694C" roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 4.2, 0.2]} scale={0.65} castShadow>
              <dodecahedronGeometry args={[1.1, 1]} />
              <meshStandardMaterial color="#557B5B" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* ===================== FLOWERING BLOSSOM TREES ===================== */}
        {FLOWERING_TREES.map(([x, y, z, s], idx) => (
          <group key={`ftree-${idx}`} position={[x, y, z]} scale={s}>
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.35, 2.4, 8]} />
              <meshStandardMaterial color="#5A4332" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.4, 0]} castShadow>
              <dodecahedronGeometry args={[1.35, 1]} />
              <meshStandardMaterial color="#E8BAC7" roughness={0.85} /> {/* Soft Dusty Pink Canopy */}
            </mesh>
            <mesh position={[0.3, 3.1, 0.1]} scale={0.75} castShadow>
              <dodecahedronGeometry args={[1.15, 1]} />
              <meshStandardMaterial color="#F7D4DE" roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===================== BOTANICAL POND & SURROUNDINGS ===================== */}
      <group position={POND_POSITION}>
        {/* Deep Pond Basin */}
        <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.6, 24]} />
          <meshStandardMaterial color="#2E443B" roughness={0.95} />
        </mesh>

        {/* Translucent Water Surface with Subtle Emerald Depth */}
        <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.4, 32]} />
          <meshStandardMaterial
            color="#588B8B"
            roughness={0.08}
            metalness={0.25}
            transparent
            opacity={0.82}
          />
        </mesh>

        {/* Perimeter River Pebbles & Weathered Boulders */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const rad = 3.2 + Math.sin(i * 3) * 0.4;
          const rockX = Math.cos(angle) * rad;
          const rockZ = Math.sin(angle) * rad;
          const scaleVal = 0.35 + (i % 3) * 0.18;
          return (
            <mesh key={`pond-rock-${i}`} position={[rockX, 0.05, rockZ]} scale={[scaleVal * 1.3, scaleVal * 0.7, scaleVal]} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.5, 1]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#7C7B76' : '#686762'} roughness={0.95} />
            </mesh>
          );
        })}

        {/* Pond Lilypads */}
        <mesh position={[-0.8, 0.02, 0.6]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <circleGeometry args={[0.45, 16]} />
          <meshStandardMaterial color="#3A5C3D" roughness={0.7} />
        </mesh>
        <mesh position={[0.7, 0.02, -0.9]} rotation={[-Math.PI / 2, 0, 1.8]}>
          <circleGeometry args={[0.35, 16]} />
          <meshStandardMaterial color="#4A6F4E" roughness={0.7} />
        </mesh>
        <mesh position={[1.2, 0.02, 0.4]} rotation={[-Math.PI / 2, 0, -0.4]}>
          <circleGeometry args={[0.4, 16]} />
          <meshStandardMaterial color="#3A5C3D" roughness={0.7} />
        </mesh>
      </group>

      {/* ===================== ARTISANAL WEATHERED WOOD BENCH ===================== */}
      <group position={BENCH_POSITION} rotation={[0, -0.4, 0]}>
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
      <group position={WATERING_CAN_POS} scale={0.75}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.35, 12]} />
          <meshStandardMaterial color="#8A9A86" roughness={0.5} metalness={0.4} /> {/* Sage Enamel */}
        </mesh>
        <mesh position={[0.22, 0.3, 0]} rotation={[0, 0, -0.6]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#8A9A86" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>

      {/* ===================== FLOWER BEDS & BOTANICAL CLUSTERS ===================== */}
      {FLOWER_CLUSTERS.map((cluster, cIdx) => (
        <group key={`cluster-${cIdx}`} position={cluster.pos as [number, number, number]}>
          {Array.from({ length: 9 }).map((_, fIdx) => {
            const angle = (fIdx / 9) * Math.PI * 2;
            const r = 0.25 + (fIdx % 3) * 0.3;
            const fx = Math.cos(angle) * r;
            const fz = Math.sin(angle) * r;
            const stemHeight = 0.25 + (fIdx % 4) * 0.08;
            return (
              <group key={`flower-${cIdx}-${fIdx}`} position={[fx, 0, fz]}>
                {/* Stem */}
                <mesh position={[0, stemHeight / 2, 0]}>
                  <cylinderGeometry args={[0.015, 0.02, stemHeight, 5]} />
                  <meshStandardMaterial color="#49684C" roughness={0.9} />
                </mesh>
                {/* Flower Blossom Petals */}
                <mesh position={[0, stemHeight + 0.04, 0]} castShadow>
                  <dodecahedronGeometry args={[0.07, 0]} />
                  <meshStandardMaterial color={cluster.color} roughness={0.8} />
                </mesh>
                {/* Center pistil */}
                <mesh position={[0, stemHeight + 0.06, 0]}>
                  <sphereGeometry args={[0.025, 6, 6]} />
                  <meshStandardMaterial color="#F4D06F" roughness={0.6} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* ===================== JAPANESE STONE LANTERN ===================== */}
      <group position={[-2, 0, -6]} scale={0.7} rotation={[0, 0.3, 0]}>
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
          <meshStandardMaterial color="#FFE8A3" emissive="#FFE8A3" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <coneGeometry args={[0.65, 0.3, 6]} />
          <meshStandardMaterial color="#6E6D68" roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}
