'use client';

// FlowerFields: Multi-colored, layered botanical wildflower fields
// Features Pink Garden, Lavender Fields, Sunny Yellow Meadow, and White Flower beds.
// All grounded accurately with getTerrainHeight to avoid z-fighting or floating.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';

interface FlowerZone {
  center: [number, number];
  radius: number;
  count: number;
  petalColor: string;
  stemColor: string;
  flowerType: 'tulip' | 'daisy' | 'lavender' | 'wildflower';
}

const ZONES: FlowerZone[] = [
  // Zone 1: Lavender Field (east / near bench)
  { center: [8, -6], radius: 4.5, count: 48, petalColor: '#B692DE', stemColor: '#3E5C3A', flowerType: 'lavender' },
  // Zone 2: Pink Rose & Peony Meadow (southwest)
  { center: [-7, 5], radius: 5.0, count: 52, petalColor: '#F28DA8', stemColor: '#436B3E', flowerType: 'tulip' },
  // Zone 3: Golden Wildflower Meadow (northwest)
  { center: [-6, -5], radius: 4.0, count: 40, petalColor: '#FFCA3A', stemColor: '#486E42', flowerType: 'wildflower' },
  // Zone 4: Pure White Jasmine & Chamomile Meadow (center-east)
  { center: [4, 6], radius: 4.2, count: 36, petalColor: '#FFFDF9', stemColor: '#486E42', flowerType: 'daisy' },
  // Zone 5: Peach & Coral Flower Border (around pond)
  { center: [-6, -13], radius: 4.8, count: 30, petalColor: '#F69477', stemColor: '#395337', flowerType: 'wildflower' },
];

export function FlowerFields() {
  const fieldRef = useRef<THREE.Group>(null);

  // Generate grounded instances
  const flowerInstances = useMemo(() => {
    const instances: {
      position: [number, number, number];
      scale: number;
      petalColor: string;
      stemColor: string;
      stemHeight: number;
      type: FlowerZone['flowerType'];
      rotY: number;
    }[] = [];

    ZONES.forEach((zone) => {
      for (let i = 0; i < zone.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * zone.radius;
        const x = zone.center[0] + Math.cos(angle) * r;
        const z = zone.center[1] + Math.sin(angle) * r;

        // Skip if inside pond water basin
        const pondDist = Math.sqrt((x - -6) ** 2 + (z - -13) ** 2);
        if (pondDist < 3.2) continue;

        const groundY = getTerrainHeight(x, z);
        const stemHeight = zone.flowerType === 'lavender' ? 0.35 + Math.random() * 0.15 : 0.22 + Math.random() * 0.12;

        instances.push({
          position: [x, groundY, z],
          scale: 0.8 + Math.random() * 0.4,
          petalColor: zone.petalColor,
          stemColor: zone.stemColor,
          stemHeight,
          type: zone.flowerType,
          rotY: Math.random() * Math.PI * 2,
        });
      }
    });

    return instances;
  }, []);

  // Gentle collective breeze sway
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fieldRef.current) {
      fieldRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 2 + i * 0.4) * 0.06;
      });
    }
  });

  return (
    <group ref={fieldRef}>
      {flowerInstances.map((f, idx) => (
        <group key={`fl-${idx}`} position={f.position} rotation={[0, f.rotY, 0]} scale={f.scale}>
          {/* Stem */}
          <mesh position={[0, f.stemHeight / 2, 0]}>
            <cylinderGeometry args={[0.012, 0.02, f.stemHeight, 5]} />
            <meshStandardMaterial color={f.stemColor} roughness={0.9} />
          </mesh>

          {/* Blossom Form */}
          {f.type === 'lavender' && (
            <mesh position={[0, f.stemHeight + 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.02, 0.22, 6]} />
              <meshStandardMaterial color={f.petalColor} roughness={0.7} />
            </mesh>
          )}

          {f.type === 'tulip' && (
            <mesh position={[0, f.stemHeight + 0.05, 0]} castShadow>
              <coneGeometry args={[0.07, 0.12, 6]} />
              <meshStandardMaterial color={f.petalColor} roughness={0.65} />
            </mesh>
          )}

          {f.type === 'daisy' && (
            <group position={[0, f.stemHeight + 0.02, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
                <meshStandardMaterial color={f.petalColor} roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <sphereGeometry args={[0.03, 6, 6]} />
                <meshStandardMaterial color="#FFD166" roughness={0.5} />
              </mesh>
            </group>
          )}

          {f.type === 'wildflower' && (
            <group position={[0, f.stemHeight + 0.03, 0]}>
              <mesh castShadow>
                <dodecahedronGeometry args={[0.065, 0]} />
                <meshStandardMaterial color={f.petalColor} roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshStandardMaterial color="#FFE066" roughness={0.4} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
