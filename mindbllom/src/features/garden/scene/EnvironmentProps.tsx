'use client';

// EnvironmentProps: Artisanal handcrafted environmental compositions across all 6 zones.
// Includes Entrance Timber Archway, Grand Ancient Blossom Tree at Bloom's Haven,
// Serene Lotus Pond with interactive ripples, Pine Grove with sitting bench,
// interactive stone lanterns, glowing mushrooms, and discoverable nature points.

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';
import type { InteractiveObjectConfig } from '../types/garden.types';

// Tree Coordinates across the sanctuary
const MATURE_TREES: [number, number, number][] = [
  [12, -11, 1.4], // Pine Grove focal tree
  [15, -8, 1.25], // Pine Grove east
  [10, -15, 1.3], // Pine Grove south
  [-14, -10, 1.35], // West of pond
  [-12, -16, 1.4],  // South of pond
  [-14, 6, 1.2],    // Meadow forest edge
  [14, 12, 1.15],   // Northeast border
  [-12, 16, 1.05],  // Entrance woods
  [12, 16, 1.1],
  [16, -2, 1.2],
];

const FLOWERING_TREES: [number, number, number][] = [
  [2.2, -2.2, 1.55], // Bloom's Grand Blossom Tree
  [-7, 8, 1.05],
  [8, -2, 0.95],
  [-12, 0, 1.0],
  [10, 3, 0.9],
];

const POND_COORDS: [number, number] = [-9, -13];
const BENCH_COORDS: [number, number] = [12, -11];
const ENTRANCE_ARCH_COORDS: [number, number] = [0, 17];
const HAVEN_BENCH_COORDS: [number, number] = [3.8, -3.2];

interface EnvironmentPropsProps {
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
  onSitBench?: (pos: [number, number, number]) => void;
  onTouchWater?: () => void;
  onTriggerDiscovery?: (text: string) => void;
}

export function EnvironmentProps({
  onRegisterObjects,
  onSitBench,
  onTouchWater,
  onTriggerDiscovery,
}: EnvironmentPropsProps) {
  const waterRef = useRef<THREE.Mesh>(null);
  const rippleMeshRef = useRef<THREE.Mesh>(null);
  const [rippleActive, setRippleActive] = useState(false);
  const rippleTimerRef = useRef(0);

  // Lantern & mushroom interactive states
  const [lanternLit, setLanternLit] = useState(true);
  const [mushroomsGlowing, setMushroomsGlowing] = useState(false);

  const pondY = getTerrainHeight(POND_COORDS[0], POND_COORDS[1]) + 0.14;
  const benchY = getTerrainHeight(BENCH_COORDS[0], BENCH_COORDS[1]);
  const havenBenchY = getTerrainHeight(HAVEN_BENCH_COORDS[0], HAVEN_BENCH_COORDS[1]);
  const archY = getTerrainHeight(ENTRANCE_ARCH_COORDS[0], ENTRANCE_ARCH_COORDS[1]);

  const handlePondInteract = () => {
    setRippleActive(true);
    rippleTimerRef.current = 0;
    if (onTouchWater) onTouchWater();
  };

  const handleBenchInteract = () => {
    if (onSitBench) {
      onSitBench([BENCH_COORDS[0], benchY + 0.38, BENCH_COORDS[1]]);
    }
  };

  const handleLanternInteract = () => {
    setLanternLit((prev) => !prev);
    if (onTriggerDiscovery) {
      onTriggerDiscovery(!lanternLit ? '✨ Kindled warm pagoda lantern flame' : '🌙 Extinguished lantern to gaze at stars');
    }
  };

  const handleMushroomInteract = () => {
    setMushroomsGlowing(true);
    if (onTriggerDiscovery) {
      onTriggerDiscovery('🍄 Woodland mushrooms release bioluminescent fairy spores');
    }
    setTimeout(() => setMushroomsGlowing(false), 8000);
  };

  useEffect(() => {
    const lanY = getTerrainHeight(10, -9);
    const mushY = getTerrainHeight(11, -10);

    const objects: InteractiveObjectConfig[] = [
      {
        id: 'pond_water',
        type: 'pond',
        position: [POND_COORDS[0], pondY, POND_COORDS[1]],
        interactionRadius: 3.8,
        promptLabel: 'Touch water ripples',
        actionKey: 'E',
        onInteract: handlePondInteract,
      },
      {
        id: 'grove_bench',
        type: 'bench',
        position: [BENCH_COORDS[0], benchY, BENCH_COORDS[1]],
        interactionRadius: 2.8,
        promptLabel: 'Sit down and take a mindful breath',
        actionKey: 'E',
        onInteract: handleBenchInteract,
      },
      {
        id: 'grove_lantern',
        type: 'lantern',
        position: [10, lanY, -9],
        interactionRadius: 2.5,
        promptLabel: lanternLit ? 'Tend Pagoda Lantern' : 'Light Pagoda Lantern',
        actionKey: 'E',
        onInteract: handleLanternInteract,
      },
      {
        id: 'grove_mushrooms',
        type: 'plant',
        position: [11, mushY, -10],
        interactionRadius: 2.5,
        promptLabel: 'Inspect Glowing Forest Mushrooms',
        actionKey: 'E',
        onInteract: handleMushroomInteract,
      },
    ];
    onRegisterObjects(objects);
  }, [onRegisterObjects, pondY, benchY, lanternLit]);

  // Natural water breathing motion & interactive ripples
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = pondY + Math.sin(t * 1.6) * 0.015;
    }

    if (rippleActive && rippleMeshRef.current) {
      rippleTimerRef.current += delta * 1.8;
      const progress = rippleTimerRef.current;
      if (progress < 1) {
        rippleMeshRef.current.scale.set(1 + progress * 2.5, 1 + progress * 2.5, 1);
        (rippleMeshRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.7;
        rippleMeshRef.current.visible = true;
      } else {
        setRippleActive(false);
        rippleMeshRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      {/* ===================== ZONE A: ENTRANCE TIMBER ARCHWAY ===================== */}
      <group position={[ENTRANCE_ARCH_COORDS[0], archY, ENTRANCE_ARCH_COORDS[1]]}>
        <mesh position={[-2.2, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 3.2, 8]} />
          <meshStandardMaterial color="#4A3525" roughness={0.88} />
        </mesh>
        <mesh position={[2.2, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 3.2, 8]} />
          <meshStandardMaterial color="#4A3525" roughness={0.88} />
        </mesh>
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[5.2, 0.24, 0.32]} />
          <meshStandardMaterial color="#5C4033" roughness={0.85} />
        </mesh>
        <mesh position={[0, 3.42, 0]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[5.4, 0.1, 0.7]} />
          <meshStandardMaterial color="#302018" roughness={0.9} />
        </mesh>
        <mesh position={[-1.8, 2.7, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.3, 6]} />
          <meshStandardMaterial color="#FFE5A3" emissive="#FFAA00" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[1.8, 2.7, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.3, 6]} />
          <meshStandardMaterial color="#FFE5A3" emissive="#FFAA00" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ===================== ZONE F: BLOOM'S HAVEN GRAND BLOSSOM TREE ===================== */}
      {FLOWERING_TREES.map(([x, z, s], idx) => {
        const groundY = getTerrainHeight(x, z);
        const isHavenTree = idx === 0;

        return (
          <group key={`ftree-${idx}`} position={[x, groundY, z]} scale={s}>
            <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[isHavenTree ? 0.38 : 0.2, isHavenTree ? 0.58 : 0.35, 2.8, 8]} />
              <meshStandardMaterial color="#543D2B" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.8, 0]} castShadow>
              <dodecahedronGeometry args={[isHavenTree ? 2.2 : 1.4, 1]} />
              <meshStandardMaterial color={isHavenTree ? '#FFB5C5' : '#FFCAD4'} roughness={0.7} />
            </mesh>
            <mesh position={[0.5, 3.6, 0.2]} scale={0.8} castShadow>
              <dodecahedronGeometry args={[isHavenTree ? 1.8 : 1.2, 1]} />
              <meshStandardMaterial color="#FFA6BE" roughness={0.7} />
            </mesh>
            <mesh position={[-0.4, 4.2, -0.2]} scale={0.65} castShadow>
              <dodecahedronGeometry args={[isHavenTree ? 1.5 : 1.0, 1]} />
              <meshStandardMaterial color="#FFD1DC" roughness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* ===================== ZONE E: PINE GROVE & MATURE TREES ===================== */}
      {MATURE_TREES.map(([x, z, s], idx) => {
        const groundY = getTerrainHeight(x, z);
        return (
          <group key={`mtree-${idx}`} position={[x, groundY, z]} scale={s}>
            <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.48, 3.2, 8]} />
              <meshStandardMaterial color="#4A3828" roughness={0.92} />
            </mesh>
            <mesh position={[0, 3.2, 0]} castShadow>
              <dodecahedronGeometry args={[1.6, 1]} />
              <meshStandardMaterial color="#2B5825" roughness={0.8} />
            </mesh>
            <mesh position={[0.4, 4.1, -0.2]} scale={0.8} castShadow>
              <dodecahedronGeometry args={[1.4, 1]} />
              <meshStandardMaterial color="#3A6E32" roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 4.8, 0.3]} scale={0.6} castShadow>
              <dodecahedronGeometry args={[1.2, 1]} />
              <meshStandardMaterial color="#498240" roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Glowing Woodland Mushrooms in Pine Grove */}
      {Array.from({ length: 6 }).map((_, i) => {
        const mx = 11 + (i % 3) * 1.2;
        const mz = -10 - Math.floor(i / 3) * 1.4;
        const my = getTerrainHeight(mx, mz);
        return (
          <group key={`mush-${i}`} position={[mx, my, mz]} scale={0.45}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.3, 6]} />
              <meshStandardMaterial color="#EDE0D4" />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial
                color={mushroomsGlowing ? '#80ED99' : '#E76F51'}
                emissive={mushroomsGlowing ? '#57CC99' : '#E76F51'}
                emissiveIntensity={mushroomsGlowing ? 0.9 : 0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* ===================== ZONE D: SERENE LOTUS POND ===================== */}
      <group position={[POND_COORDS[0], 0, POND_COORDS[1]]}>
        <mesh position={[0, pondY - 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.4, 28]} />
          <meshStandardMaterial color="#1C3820" roughness={0.95} />
        </mesh>

        <mesh
          ref={waterRef}
          position={[0, pondY, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            handlePondInteract();
          }}
        >
          <circleGeometry args={[4.2, 32]} />
          <meshStandardMaterial
            color="#2A9D8F"
            roughness={0.06}
            metalness={0.25}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Interactive Ripple Circle */}
        <mesh ref={rippleMeshRef} position={[0, pondY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.3, 0.45, 24]} />
          <meshBasicMaterial color="#E0FBFC" transparent opacity={0.7} />
        </mesh>

        {/* Perimeter River Boulders & Shoreline Stones */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const rad = 3.9 + Math.sin(i * 3.3) * 0.5;
          const rockX = Math.cos(angle) * rad;
          const rockZ = Math.sin(angle) * rad;
          const rockY = getTerrainHeight(POND_COORDS[0] + rockX, POND_COORDS[1] + rockZ);
          const scaleVal = 0.38 + (i % 3) * 0.16;
          return (
            <mesh
              key={`pond-rock-${i}`}
              position={[rockX, rockY + 0.05, rockZ]}
              scale={[scaleVal * 1.3, scaleVal * 0.75, scaleVal]}
              castShadow
              receiveShadow
            >
              <dodecahedronGeometry args={[0.5, 1]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#8E8D86' : '#73726B'} roughness={0.92} />
            </mesh>
          );
        })}

        {/* Floating Pond Lilypads & Lotus Flowers */}
        <group position={[-1.2, pondY + 0.015, 0.8]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <mesh>
            <circleGeometry args={[0.5, 16]} />
            <meshStandardMaterial color="#2D6A4F" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#FFB5C5" />
          </mesh>
        </group>

        <group position={[1.4, pondY + 0.015, -1.2]} rotation={[-Math.PI / 2, 0, 1.8]}>
          <mesh>
            <circleGeometry args={[0.42, 16]} />
            <meshStandardMaterial color="#40916C" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FFF0F5" />
          </mesh>
        </group>
      </group>

      {/* ===================== ZONE E: ARTISANAL GROVE BENCH ===================== */}
      <group
        position={[BENCH_COORDS[0], benchY, BENCH_COORDS[1]]}
        rotation={[0, -0.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          handleBenchInteract();
        }}
      >
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.55]} />
          <meshStandardMaterial color="#6A4E38" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.75, -0.24]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.07]} />
          <meshStandardMaterial color="#6A4E38" roughness={0.88} />
        </mesh>
        <mesh position={[-0.7, 0.16, 0]} castShadow>
          <boxGeometry args={[0.1, 0.35, 0.48]} />
          <meshStandardMaterial color="#3A3836" roughness={0.9} />
        </mesh>
        <mesh position={[0.7, 0.16, 0]} castShadow>
          <boxGeometry args={[0.1, 0.35, 0.48]} />
          <meshStandardMaterial color="#3A3836" roughness={0.9} />
        </mesh>
      </group>

      {/* ===================== ZONE F: HAVEN SITTING BENCH ===================== */}
      <group position={[HAVEN_BENCH_COORDS[0], havenBenchY, HAVEN_BENCH_COORDS[1]]} rotation={[0, 0.8, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#7D5C42" roughness={0.88} />
        </mesh>
        <mesh position={[-0.6, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
          <meshStandardMaterial color="#4A3828" />
        </mesh>
        <mesh position={[0.6, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
          <meshStandardMaterial color="#4A3828" />
        </mesh>
      </group>

      {/* ===================== STONE PAGODA LANTERNS ===================== */}
      {(() => {
        const lanterns: [number, number][] = [
          [10, -9],   // Grove path
          [-1.5, -4], // Haven entrance
          [-7, -10],  // Pond path
        ];
        return lanterns.map(([lx, lz], i) => {
          const ly = getTerrainHeight(lx, lz);
          return (
            <group
              key={`lan-${i}`}
              position={[lx, ly, lz]}
              scale={0.65}
              rotation={[0, 0.4 * i, 0]}
              onClick={(e) => {
                if (i === 0) {
                  e.stopPropagation();
                  handleLanternInteract();
                }
              }}
            >
              <mesh position={[0, 0.2, 0]} castShadow>
                <cylinderGeometry args={[0.28, 0.38, 0.4, 6]} />
                <meshStandardMaterial color="#7D7C76" roughness={0.92} />
              </mesh>
              <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[0.38, 0.38, 0.38]} />
                <meshStandardMaterial color="#7D7C76" roughness={0.92} />
              </mesh>
              <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.26, 0.26, 0.26]} />
                <meshStandardMaterial
                  color={lanternLit ? '#FFE8A3' : '#4A4A45'}
                  emissive={lanternLit ? '#FFAA00' : '#000000'}
                  emissiveIntensity={lanternLit ? 0.9 : 0}
                />
              </mesh>
              <mesh position={[0, 0.95, 0]} castShadow>
                <coneGeometry args={[0.62, 0.3, 6]} />
                <meshStandardMaterial color="#6E6D68" roughness={0.92} />
              </mesh>
            </group>
          );
        });
      })()}
    </group>
  );
}


