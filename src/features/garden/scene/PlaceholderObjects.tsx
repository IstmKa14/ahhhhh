'use client';

// PlaceholderObjects: stub geometry for interactive scene objects.
// Uses InstancedMesh for rocks and bushes (one draw call per type).
// Phase 5 replaces the geometry with real models and interaction logic.
// Each object is registered in the interactiveObjects list so the
// interaction system works from day one.

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { InteractiveObjectConfig } from '../types/garden.types';

// Rock positions — scattered around the terrain
const ROCK_POSITIONS: [number, number, number][] = [
  [-8, 0.3, -6],
  [10, 0.25, -12],
  [-15, 0.35, 8],
  [7, 0.28, 14],
];

// Bush positions
const BUSH_POSITIONS: [number, number, number][] = [
  [4, 0.5, -8],
  [-6, 0.6, -14],
  [12, 0.55, 4],
  [-10, 0.5, 12],
  [2, 0.5, 18],
  [-18, 0.6, -4],
];

// Pond position
const POND_POSITION: [number, number, number] = [-5, 0.01, -18];
// Bench position
const BENCH_POSITION: [number, number, number] = [8, 0.5, -10];

const matrix = new THREE.Matrix4();
const scale = new THREE.Vector3();
const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();

interface PlaceholderObjectsProps {
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
}

export function PlaceholderObjects({ onRegisterObjects }: PlaceholderObjectsProps) {
  const rockRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);

  // Set instance matrices for rocks
  useEffect(() => {
    const mesh = rockRef.current;
    if (!mesh) return;
    ROCK_POSITIONS.forEach((pos, i) => {
      position.set(...pos);
      scale.setScalar(0.5 + Math.random() * 0.3);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  // Set instance matrices for bushes
  useEffect(() => {
    const mesh = bushRef.current;
    if (!mesh) return;
    BUSH_POSITIONS.forEach((pos, i) => {
      position.set(...pos);
      scale.setScalar(0.6 + Math.random() * 0.4);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  // Register interactable objects
  useEffect(() => {
    const objects: InteractiveObjectConfig[] = [
      {
        id: 'pond',
        type: 'pond',
        position: POND_POSITION,
        interactionRadius: 3,
        promptLabel: 'Watch the water',
        onInteract: () => console.log('pond interact'),
      },
      {
        id: 'bench',
        type: 'bench',
        position: BENCH_POSITION,
        interactionRadius: 2.5,
        promptLabel: 'Sit down',
        onInteract: () => console.log('bench interact'),
      },
    ];
    onRegisterObjects(objects);
  }, [onRegisterObjects]);

  return (
    <group>
      {/* Rocks: one draw call via InstancedMesh */}
      <instancedMesh ref={rockRef} args={[undefined, undefined, ROCK_POSITIONS.length]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 6, 4]} />
        <meshStandardMaterial color="#8A8A84" roughness={0.95} metalness={0} />
      </instancedMesh>

      {/* Bushes: one draw call via InstancedMesh */}
      <instancedMesh ref={bushRef} args={[undefined, undefined, BUSH_POSITIONS.length]} castShadow>
        <sphereGeometry args={[0.7, 7, 5]} />
        <meshStandardMaterial color="#4A7C59" roughness={0.9} metalness={0} />
      </instancedMesh>

      {/* Pond: flat circle */}
      <mesh position={POND_POSITION} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#4A7F9E" roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>

      {/* Bench: simple box */}
      <mesh position={BENCH_POSITION} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.1, 0.5]} />
        <meshStandardMaterial color="#7A5C3C" roughness={0.85} />
      </mesh>
      {/* Bench legs */}
      <mesh position={[BENCH_POSITION[0] - 0.55, BENCH_POSITION[1] - 0.25, BENCH_POSITION[2]]} castShadow>
        <boxGeometry args={[0.08, 0.5, 0.4]} />
        <meshStandardMaterial color="#6A4C2C" roughness={0.9} />
      </mesh>
      <mesh position={[BENCH_POSITION[0] + 0.55, BENCH_POSITION[1] - 0.25, BENCH_POSITION[2]]} castShadow>
        <boxGeometry args={[0.08, 0.5, 0.4]} />
        <meshStandardMaterial color="#6A4C2C" roughness={0.9} />
      </mesh>
    </group>
  );
}
