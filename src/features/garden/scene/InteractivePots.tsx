'use client';

// InteractivePots: Planting lifecycle & interactive flower pots.
// Supports Seed -> Sprout -> Growing -> Blooming progression with watering responses.

import { useState } from 'react';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';
import type { PlantGrowthStage, PlantPotData } from '../types/garden.types';

const INITIAL_POTS: PlantPotData[] = [
  { id: 'pot-1', position: [1.8, 0, 7], stage: 'blooming', waterLevel: 80, flowerColor: '#F72585' },
  { id: 'pot-2', position: [2.8, 0, 7.5], stage: 'growing', waterLevel: 50, flowerColor: '#7209B7' },
  { id: 'pot-3', position: [3.8, 0, 8], stage: 'sprout', waterLevel: 30, flowerColor: '#4CC9F0' },
  { id: 'pot-4', position: [4.8, 0, 8.5], stage: 'seed', waterLevel: 10, flowerColor: '#FFB703' },
];

export function InteractivePots() {
  const [pots, setPots] = useState<PlantPotData[]>(INITIAL_POTS);
  const [activePotId, setActivePotId] = useState<string | null>(null);

  const handleWaterPot = (id: string) => {
    setPots((prev) =>
      prev.map((pot) => {
        if (pot.id !== id) return pot;
        const nextWater = Math.min(100, pot.waterLevel + 35);
        let nextStage: PlantGrowthStage = pot.stage;
        if (pot.stage === 'seed' && nextWater >= 40) nextStage = 'sprout';
        else if (pot.stage === 'sprout' && nextWater >= 70) nextStage = 'growing';
        else if (pot.stage === 'growing' && nextWater >= 95) nextStage = 'blooming';
        return { ...pot, waterLevel: nextWater, stage: nextStage };
      })
    );
  };

  return (
    <group>
      {pots.map((pot) => {
        const [x, , z] = pot.position;
        const groundY = getTerrainHeight(x, z);
        const isActive = activePotId === pot.id;

        return (
          <group
            key={pot.id}
            position={[x, groundY, z]}
            onPointerOver={() => {
              setActivePotId(pot.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setActivePotId(null);
              document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleWaterPot(pot.id);
            }}
          >
            {/* Terracotta Planter Pot */}
            <mesh position={[0, 0.22, 0]} scale={isActive ? 1.06 : 1} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.18, 0.42, 16]} />
              <meshStandardMaterial color="#C86D51" roughness={0.75} />
            </mesh>

            {/* Rich Dark Soil Layer */}
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.06, 16]} />
              <meshStandardMaterial
                color={pot.waterLevel > 50 ? '#2E1F14' : '#4E382A'}
                roughness={0.95}
              />
            </mesh>

            {/* Growth Stage Visualization */}
            {pot.stage === 'seed' && (
              <mesh position={[0, 0.42, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#8B5A2B" />
              </mesh>
            )}

            {pot.stage === 'sprout' && (
              <group position={[0, 0.4, 0]}>
                <mesh position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[0.015, 0.02, 0.12, 6]} />
                  <meshStandardMaterial color="#70B85D" />
                </mesh>
                <mesh position={[-0.03, 0.12, 0]} rotation={[0, 0, 0.5]}>
                  <coneGeometry args={[0.03, 0.08, 6]} />
                  <meshStandardMaterial color="#8FD175" />
                </mesh>
                <mesh position={[0.03, 0.12, 0]} rotation={[0, 0, -0.5]}>
                  <coneGeometry args={[0.03, 0.08, 6]} />
                  <meshStandardMaterial color="#8FD175" />
                </mesh>
              </group>
            )}

            {pot.stage === 'growing' && (
              <group position={[0, 0.4, 0]}>
                <mesh position={[0, 0.14, 0]}>
                  <cylinderGeometry args={[0.02, 0.025, 0.28, 6]} />
                  <meshStandardMaterial color="#4A8539" />
                </mesh>
                <mesh position={[0, 0.24, 0]} scale={0.7}>
                  <dodecahedronGeometry args={[0.15, 0]} />
                  <meshStandardMaterial color="#62A84E" />
                </mesh>
              </group>
            )}

            {pot.stage === 'blooming' && (
              <group position={[0, 0.4, 0]}>
                <mesh position={[0, 0.18, 0]}>
                  <cylinderGeometry args={[0.025, 0.03, 0.36, 6]} />
                  <meshStandardMaterial color="#3E7230" />
                </mesh>
                {/* Fully Bloomed Flower Head */}
                <mesh position={[0, 0.36, 0]} castShadow>
                  <dodecahedronGeometry args={[0.16, 0]} />
                  <meshStandardMaterial color={pot.flowerColor} roughness={0.55} />
                </mesh>
                <mesh position={[0, 0.36, 0.08]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshStandardMaterial color="#FFD166" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
