'use client';

// BloomCharacter: Artisanal living botanical companion character.
// Features soft rounded form, friendly expressive eyes, delicate leaf sprouts that sway,
// breathing life animation, footsteps bobbing, and warm organic materials.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BloomState } from '../types/garden.types';

interface BloomCharacterProps {
  state?: BloomState;
  isMoving?: boolean;
}

export function BloomCharacter({ state = 'idle', isMoving = false }: BloomCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leafLeftRef = useRef<THREE.Mesh>(null);
  const leafRightRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Natural Organic Breathing & Idle Bobbing
    if (bodyRef.current) {
      if (isMoving) {
        // Playful walking hop
        bodyRef.current.position.y = 0.45 + Math.abs(Math.sin(t * 8)) * 0.12;
        bodyRef.current.rotation.z = Math.sin(t * 8) * 0.08;
      } else {
        // Calm serene breathing
        bodyRef.current.position.y = 0.45 + Math.sin(t * 2.2) * 0.035;
        bodyRef.current.scale.set(
          1 + Math.sin(t * 2.2) * 0.02,
          1 + Math.cos(t * 2.2) * 0.03,
          1 + Math.sin(t * 2.2) * 0.02
        );
        bodyRef.current.rotation.z = 0;
      }
    }

    // Leaf Sprout Flutter
    if (leafLeftRef.current && leafRightRef.current) {
      const flutterSpeed = isMoving ? 12 : 3;
      leafLeftRef.current.rotation.z = 0.4 + Math.sin(t * flutterSpeed) * 0.15;
      leafRightRef.current.rotation.z = -0.4 - Math.sin(t * flutterSpeed + 0.5) * 0.15;
    }

    // Gentle Blinking every few seconds
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = t % 4;
      const isBlinking = blinkCycle > 3.85;
      eyeLeftRef.current.scale.y = isBlinking ? 0.1 : 1;
      eyeRightRef.current.scale.y = isBlinking ? 0.1 : 1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft Contact Shadow beneath Bloom */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#1B2B1E" opacity={0.35} transparent />
      </mesh>

      {/* Main Articulated Body Group */}
      <group ref={bodyRef} position={[0, 0.45, 0]}>
        {/* Soft Botanical Head/Body (Pear-like friendly shape) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.38, 20, 20]} />
          <meshStandardMaterial
            color="#F7F1E5" // Warm artisan porcelain / soft cream
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Muted Sage Botanical Body Cape/Vest */}
        <mesh position={[0, -0.12, 0]} scale={[1.04, 0.65, 1.04]} castShadow>
          <sphereGeometry args={[0.36, 18, 18]} />
          <meshStandardMaterial
            color="#8DAA91" // Muted Sage
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>

        {/* Expressive Soft Charcoal Eyes */}
        <mesh ref={eyeLeftRef} position={[-0.11, 0.06, 0.32]} castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#2B2B28" roughness={0.3} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.11, 0.06, 0.32]} castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#2B2B28" roughness={0.3} />
        </mesh>

        {/* Rosy Cheeks (Soft Dusty Pink) */}
        <mesh position={[-0.18, -0.02, 0.31]}>
          <circleGeometry args={[0.04, 12]} />
          <meshBasicMaterial color="#E8A598" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.18, -0.02, 0.31]}>
          <circleGeometry args={[0.04, 12]} />
          <meshBasicMaterial color="#E8A598" opacity={0.6} transparent />
        </mesh>

        {/* Botanical Sprout on Head */}
        <group position={[0, 0.36, 0]}>
          {/* Sprout Stem */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.12, 6]} />
            <meshStandardMaterial color="#5E8362" roughness={0.8} />
          </mesh>
          {/* Left Sprout Leaf */}
          <mesh ref={leafLeftRef} position={[-0.07, 0.13, 0]} rotation={[0, 0, 0.4]} castShadow>
            <coneGeometry args={[0.06, 0.16, 6]} />
            <meshStandardMaterial color="#709F75" roughness={0.7} />
          </mesh>
          {/* Right Sprout Leaf */}
          <mesh ref={leafRightRef} position={[0.07, 0.13, 0]} rotation={[0, 0, -0.4]} castShadow>
            <coneGeometry args={[0.06, 0.16, 6]} />
            <meshStandardMaterial color="#88B88E" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
