'use client';

// InteractivePots: Botanical Nursery planters, raised beds, and plant lifecycle.
// Supports Seed -> Sprout -> Growing -> Blooming progression with watering responses.
// Grounded accurately with getTerrainHeight.

import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';
import type { PlantGrowthStage, PlantPotData, InteractiveObjectConfig } from '../types/garden.types';

const INITIAL_POTS: PlantPotData[] = [
  { id: 'pot-1', position: [5.8, 0, 6.2], stage: 'blooming', waterLevel: 80, flowerColor: '#F72585', plantName: 'Starlight Orchid' },
  { id: 'pot-2', position: [7.0, 0, 6.8], stage: 'growing', waterLevel: 50, flowerColor: '#7209B7', plantName: 'Amethyst Sage' },
  { id: 'pot-3', position: [8.2, 0, 7.4], stage: 'sprout', waterLevel: 30, flowerColor: '#4CC9F0', plantName: 'Azure Bluebell' },
  { id: 'pot-4', position: [6.4, 0, 8.2], stage: 'seed', waterLevel: 10, flowerColor: '#FFB703', plantName: 'Solar Sunflower' },
  { id: 'pot-5', position: [7.6, 0, 8.8], stage: 'growing', waterLevel: 60, flowerColor: '#FB5607', plantName: 'Ember Dahlia' },
  { id: 'pot-6', position: [8.8, 0, 9.4], stage: 'blooming', waterLevel: 90, flowerColor: '#FF006E', plantName: 'Ruby Petunia' },
];

interface InteractivePotsProps {
  onWaterPlant?: (potId: string, plantName: string) => void;
  onRegisterObjects?: (objects: InteractiveObjectConfig[]) => void;
}

export function InteractivePots({ onWaterPlant, onRegisterObjects }: InteractivePotsProps) {
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
        if (onWaterPlant) {
          onWaterPlant(pot.id, pot.plantName);
        }
        return { ...pot, waterLevel: nextWater, stage: nextStage };
      })
    );
  };

  // Register pots to interaction detector
  useEffect(() => {
    if (!onRegisterObjects) return;
    const objs: InteractiveObjectConfig[] = pots.map((p) => {
      const [x, , z] = p.position;
      const groundY = getTerrainHeight(x, z);
      return {
        id: p.id,
        type: 'pot',
        position: [x, groundY, z],
        interactionRadius: 2.2,
        promptLabel: `Water ${p.plantName} (${p.stage})`,
        actionKey: 'E',
        onInteract: () => handleWaterPot(p.id),
      };
    });
    onRegisterObjects(objs);
  }, [pots, onRegisterObjects]);

  // Wooden Plant Table Dimensions
  const tableX = 7.2;
  const tableZ = 7.8;
  const tableY = getTerrainHeight(tableX, tableZ);

  return (
    <group>
      {/* ===================== RAISED WOODEN GARDEN TABLE ===================== */}
      <group position={[tableX, tableY, tableZ]} rotation={[0, 0.4, 0]}>
        {/* Table Top Surface */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.08, 1.6]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.88} />
        </mesh>
        {/* Table Legs */}
        <mesh position={[-1.8, 0.25, -0.6]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
          <meshStandardMaterial color="#4A3525" roughness={0.9} />
        </mesh>
        <mesh position={[1.8, 0.25, -0.6]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
          <meshStandardMaterial color="#4A3525" roughness={0.9} />
        </mesh>
        <mesh position={[-1.8, 0.25, 0.6]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
          <meshStandardMaterial color="#4A3525" roughness={0.9} />
        </mesh>
        <mesh position={[1.8, 0.25, 0.6]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
          <meshStandardMaterial color="#4A3525" roughness={0.9} />
        </mesh>
      </group>

      {/* ===================== INTERACTIVE POTS ===================== */}
      {pots.map((pot, idx) => {
        const [x, , z] = pot.position;
        const groundY = getTerrainHeight(x, z);
        const isTablePot = idx < 3;
        const potY = isTablePot ? tableY + 0.54 : groundY;
        const isActive = activePotId === pot.id;
        const isTerracotta = idx % 2 === 0;

        return (
          <group
            key={pot.id}
            position={[x, potY, z]}
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
            {/* Planter Pot Form */}
            <mesh position={[0, 0.2, 0]} scale={isActive ? 1.08 : 1} castShadow receiveShadow>
              <cylinderGeometry args={[0.24, 0.16, 0.38, 16]} />
              <meshStandardMaterial
                color={isTerracotta ? '#D07455' : '#8EAE94'}
                roughness={0.7}
              />
            </mesh>

            {/* Rich Dark Soil Layer */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
              <meshStandardMaterial
                color={pot.waterLevel > 50 ? '#26180E' : '#4E382A'}
                roughness={0.95}
              />
            </mesh>

            {/* Growth Stage Visualization */}
            {pot.stage === 'seed' && (
              <mesh position={[0, 0.39, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#8B5A2B" />
              </mesh>
            )}

            {pot.stage === 'sprout' && (
              <group position={[0, 0.36, 0]}>
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
              <group position={[0, 0.36, 0]}>
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
              <group position={[0, 0.36, 0]}>
                <mesh position={[0, 0.18, 0]}>
                  <cylinderGeometry args={[0.025, 0.03, 0.36, 6]} />
                  <meshStandardMaterial color="#3E7230" />
                </mesh>
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

