'use client';

// NavigationWall: Physical artistic wooden & stone monument in the Garden.
// Anchors the entrance with ivy vines, hanging signs, and interactive portals
// to Bloom Chat, Journal, Resources, Games, and Dashboard.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@react-three/drei';
import { getTerrainHeight } from '../utils/terrainMath';

interface NavPortal {
  title: string;
  href: string;
  color: string;
  position: [number, number, number];
}

const PORTALS: NavPortal[] = [
  { title: 'BLOOM AI', href: '/chat', color: '#52B788', position: [-1.4, 1.2, 0.12] },
  { title: 'JOURNAL', href: '/journal', color: '#E07A5F', position: [0, 1.2, 0.12] },
  { title: 'RESOURCES', href: '/resources', color: '#3D5A80', position: [1.4, 1.2, 0.12] },
  { title: 'GAMES', href: '/games', color: '#F4A261', position: [-0.7, 0.5, 0.12] },
  { title: 'DASHBOARD', href: '/dashboard', color: '#81B29A', position: [0.7, 0.5, 0.12] },
];

export function NavigationWall() {
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const wallX = -0.5;
  const wallZ = 15;
  const wallY = getTerrainHeight(wallX, wallZ);

  return (
    <group position={[wallX, wallY, wallZ]} rotation={[0, Math.PI, 0]}>
      {/* Stone Foundation Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 0.5, 0.8]} />
        <meshStandardMaterial color="#7D7C76" roughness={0.92} />
      </mesh>

      {/* Main Weathered Timber Board */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.8, 0.2]} />
        <meshStandardMaterial color="#5C4033" roughness={0.85} />
      </mesh>

      {/* Wooden Roof Shingles / Overhang */}
      <mesh position={[0, 2.35, 0.1]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[4.5, 0.15, 0.7]} />
        <meshStandardMaterial color="#3E2723" roughness={0.88} />
      </mesh>

      {/* Title Header Carving */}
      <group position={[0, 2.05, 0.11]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3.2, 0.35]} />
          <meshBasicMaterial color="#2B1D0C" opacity={0.4} transparent />
        </mesh>
        <Text
          fontSize={0.2}
          color="#FFF8E7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          MINDBLOOM SANCTUARY
        </Text>
      </group>

      {/* Interactive Destination Portals */}
      {PORTALS.map((portal, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <group
            key={portal.title}
            position={portal.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredIdx(idx);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredIdx(null);
              document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(portal.href);
            }}
          >
            {/* Wooden Plaque */}
            <mesh scale={isHovered ? 1.08 : 1} castShadow>
              <boxGeometry args={[1.2, 0.45, 0.08]} />
              <meshStandardMaterial
                color={isHovered ? '#FFF2D6' : '#EAE0D5'}
                roughness={0.6}
              />
            </mesh>

            {/* Plaque Color Accent Dot */}
            <mesh position={[-0.45, 0, 0.045]}>
              <circleGeometry args={[0.06, 12]} />
              <meshBasicMaterial color={portal.color} />
            </mesh>

            {/* Text Label */}
            <Text
              position={[0.05, 0, 0.05]}
              fontSize={0.12}
              color={isHovered ? '#111111' : '#2D2D2A'}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {portal.title}
            </Text>
          </group>
        );
      })}

      {/* Decorative Ivy Vines and Flowers crawling up the wall */}
      <mesh position={[-2.0, 1.2, 0.12]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.06, 1.8, 6]} />
        <meshStandardMaterial color="#3A5C3D" roughness={0.9} />
      </mesh>
      <mesh position={[2.0, 1.3, 0.12]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.04, 0.06, 2.0, 6]} />
        <meshStandardMaterial color="#3A5C3D" roughness={0.9} />
      </mesh>
    </group>
  );
}

