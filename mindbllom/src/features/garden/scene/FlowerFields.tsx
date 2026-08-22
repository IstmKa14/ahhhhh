'use client';

// FlowerFields: Multi-colored, dense botanical wildflower fields
// Features Pink Peony Grove, Lavender Fields, Sunny Yellow Meadow, Pure White Chamomile,
// and Peach/Coral Lotus borders.
// Supports interactive flower picking with bending animation and sparkling petals.

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';
import type { InteractiveObjectConfig } from '../types/garden.types';

interface FlowerZone {
  center: [number, number];
  radius: number;
  count: number;
  petalColor: string;
  stemColor: string;
  flowerType: 'tulip' | 'daisy' | 'lavender' | 'wildflower' | 'peony' | 'cosmos';
  name: string;
}

const FLOWER_ZONES: FlowerZone[] = [
  // 1. Lavender Field (near Pine Grove path)
  { center: [8, -6], radius: 4.8, count: 52, petalColor: '#9D7AD6', stemColor: '#3E5C3A', flowerType: 'lavender', name: 'Royal Lavender' },
  // 2. Pink Rose & Peony Meadow (southwest)
  { center: [-11, 4], radius: 6.2, count: 64, petalColor: '#F78DA7', stemColor: '#436B3E', flowerType: 'peony', name: 'Pink Peony' },
  // 3. Golden Wildflower Meadow (west)
  { center: [-8, -2], radius: 5.0, count: 48, petalColor: '#FFCA3A', stemColor: '#486E42', flowerType: 'wildflower', name: 'Golden Sunburst' },
  // 4. White Chamomile & Jasmine (northeast)
  { center: [5, 4], radius: 4.5, count: 42, petalColor: '#FFFDF9', stemColor: '#486E42', flowerType: 'daisy', name: 'Sweet Chamomile' },
  // 5. Peach & Coral Flower Border (pond edge)
  { center: [-9, -13], radius: 6.2, count: 38, petalColor: '#F9844A', stemColor: '#395337', flowerType: 'cosmos', name: 'Coral Blossom' },
  // 6. Purple Cosmos near Haven
  { center: [4, -4], radius: 3.5, count: 28, petalColor: '#B5179E', stemColor: '#3A5C3D', flowerType: 'cosmos', name: 'Mindful Cosmos' },
];

interface FlowerFieldsProps {
  onPickFlower?: (name: string, color: string) => void;
  onRegisterObjects?: (objects: InteractiveObjectConfig[]) => void;
}

export function FlowerFields({ onPickFlower, onRegisterObjects }: FlowerFieldsProps) {
  const fieldRef = useRef<THREE.Group>(null);
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());

  // Generate grounded instances
  const { flowerInstances, interactables } = useMemo(() => {
    const instances: {
      id: string;
      position: [number, number, number];
      scale: number;
      petalColor: string;
      stemColor: string;
      stemHeight: number;
      type: FlowerZone['flowerType'];
      rotY: number;
      isInteractive: boolean;
      name: string;
    }[] = [];

    const interactiveList: { id: string; name: string; color: string; pos: [number, number, number] }[] = [];

    let idCounter = 0;
    FLOWER_ZONES.forEach((zone) => {
      for (let i = 0; i < zone.count; i++) {
        idCounter++;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * zone.radius;
        const x = zone.center[0] + Math.cos(angle) * r;
        const z = zone.center[1] + Math.sin(angle) * r;

        // Skip if inside pond water basin
        const pondDist = Math.sqrt((x - -9) ** 2 + (z - -13) ** 2);
        if (pondDist < 4.0) continue;

        const groundY = getTerrainHeight(x, z);
        const stemHeight = zone.flowerType === 'lavender' ? 0.38 + Math.random() * 0.16 : 0.24 + Math.random() * 0.14;
        const flowerId = `fl-${idCounter}`;
        const isInteractive = i % 12 === 0; // Selected prominent flowers are pickable

        instances.push({
          id: flowerId,
          position: [x, groundY, z],
          scale: 0.85 + Math.random() * 0.35,
          petalColor: zone.petalColor,
          stemColor: zone.stemColor,
          stemHeight,
          type: zone.flowerType,
          rotY: Math.random() * Math.PI * 2,
          isInteractive,
          name: zone.name,
        });

        if (isInteractive) {
          interactiveList.push({
            id: flowerId,
            name: zone.name,
            color: zone.petalColor,
            pos: [x, groundY, z],
          });
        }
      }
    });

    return { flowerInstances: instances, interactables: interactiveList };
  }, []);

  const handlePick = (id: string, name: string, color: string) => {
    setPickedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (onPickFlower) {
      onPickFlower(name, color);
    }
    // Regrow after 45 seconds
    setTimeout(() => {
      setPickedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 45000);
  };

  // Register pickable flowers to proximity system
  useEffect(() => {
    if (!onRegisterObjects) return;
    const objs: InteractiveObjectConfig[] = interactables.map((item) => ({
      id: item.id,
      type: 'flower',
      position: item.pos,
      interactionRadius: 2.2,
      promptLabel: `Pick ${item.name}`,
      actionKey: 'E',
      onInteract: () => handlePick(item.id, item.name, item.color),
    }));
    onRegisterObjects(objs);
  }, [interactables, onRegisterObjects]);

  // Gentle collective breeze sway
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fieldRef.current) {
      fieldRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 2.4 + i * 0.3) * 0.05;
      });
    }
  });

  return (
    <group ref={fieldRef}>
      {flowerInstances.map((f) => {
        const isPicked = pickedIds.has(f.id);

        return (
          <group
            key={f.id}
            position={f.position}
            rotation={[0, f.rotY, 0]}
            scale={f.scale}
            onClick={(e) => {
              if (f.isInteractive && !isPicked) {
                e.stopPropagation();
                handlePick(f.id, f.name, f.petalColor);
              }
            }}
          >
            {/* Stem */}
            <mesh position={[0, f.stemHeight / 2, 0]}>
              <cylinderGeometry args={[0.014, 0.022, f.stemHeight, 5]} />
              <meshStandardMaterial color={f.stemColor} roughness={0.9} />
            </mesh>

            {/* Blossom Form (Shrinks if picked, showing cute sprout bud) */}
            {!isPicked ? (
              <>
                {f.type === 'lavender' && (
                  <mesh position={[0, f.stemHeight + 0.1, 0]} castShadow>
                    <cylinderGeometry args={[0.04, 0.025, 0.28, 6]} />
                    <meshStandardMaterial color={f.petalColor} roughness={0.7} />
                  </mesh>
                )}

                {f.type === 'peony' && (
                  <group position={[0, f.stemHeight + 0.06, 0]}>
                    <mesh castShadow>
                      <sphereGeometry args={[0.11, 10, 10]} />
                      <meshStandardMaterial color={f.petalColor} roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.04, 0]}>
                      <sphereGeometry args={[0.05, 8, 8]} />
                      <meshStandardMaterial color="#FFE066" />
                    </mesh>
                  </group>
                )}

                {f.type === 'tulip' && (
                  <mesh position={[0, f.stemHeight + 0.06, 0]} castShadow>
                    <coneGeometry args={[0.08, 0.16, 6]} />
                    <meshStandardMaterial color={f.petalColor} roughness={0.65} />
                  </mesh>
                )}

                {f.type === 'daisy' && (
                  <group position={[0, f.stemHeight + 0.02, 0]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
                      <meshStandardMaterial color={f.petalColor} roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0.016, 0]}>
                      <sphereGeometry args={[0.035, 6, 6]} />
                      <meshStandardMaterial color="#FFD166" roughness={0.5} />
                    </mesh>
                  </group>
                )}

                {(f.type === 'wildflower' || f.type === 'cosmos') && (
                  <group position={[0, f.stemHeight + 0.03, 0]}>
                    <mesh castShadow>
                      <dodecahedronGeometry args={[0.075, 0]} />
                      <meshStandardMaterial color={f.petalColor} roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0.025, 0]}>
                      <sphereGeometry args={[0.03, 6, 6]} />
                      <meshStandardMaterial color="#FFE066" roughness={0.4} />
                    </mesh>
                  </group>
                )}
              </>
            ) : (
              // Plucked Sprout Bud
              <mesh position={[0, f.stemHeight + 0.02, 0]}>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshStandardMaterial color="#70B85D" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

