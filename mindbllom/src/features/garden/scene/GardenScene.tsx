'use client';

// GardenScene: Composes Japanese-botanical garden aesthetic with warm golden hour sky,
// multi-zone sculpted terrain, colorful flower fields, interactive planting nursery,
// Bloom companion character, physical navigation monument, and ambient atmosphere.

import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Terrain } from './Terrain';
import { FlowerFields } from './FlowerFields';
import { EnvironmentProps } from './EnvironmentProps';
import { InteractivePots } from './InteractivePots';
import { NavigationWall } from './NavigationWall';
import { Atmosphere } from './Atmosphere';
import { BloomCompanion } from '../player/BloomCompanion';
import type { InteractiveObjectConfig, QualityProfile, BloomState } from '../types/garden.types';
import { FOG_NEAR, FOG_FAR_LOW, FOG_FAR_MEDIUM, FOG_FAR_HIGH } from '../constants/garden.constants';
import { getTerrainHeight } from '../utils/terrainMath';

interface GardenSceneProps {
  profile: QualityProfile;
  bloomState: BloomState;
  onOpenChat: () => void;
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
  onRegisterSingleObject: (object: InteractiveObjectConfig) => void;
  onSitBench?: (pos: [number, number, number]) => void;
  onTouchWater?: () => void;
  onPickFlower?: (name: string, color: string) => void;
  onWaterPlant?: (potId: string, plantName: string) => void;
  onTriggerDiscovery?: (text: string) => void;
  playerPositionRef: React.RefObject<THREE.Vector3>;
}

function getFogFar(profile: QualityProfile): number {
  if (!profile.shadowsEnabled) return FOG_FAR_LOW;
  if (profile.shadowMapSize <= 1024) return FOG_FAR_MEDIUM;
  return FOG_FAR_HIGH;
}

export function GardenScene({
  profile,
  bloomState,
  onOpenChat,
  onRegisterObjects,
  onRegisterSingleObject,
  onSitBench,
  onTouchWater,
  onPickFlower,
  onWaterPlant,
  onTriggerDiscovery,
  playerPositionRef,
}: GardenSceneProps) {
  const fogFar = getFogFar(profile);

  return (
    <>
      {/* Soft Luminous Atmospheric Fog blending into the horizon */}
      <fog attach="fog" args={['#CDE3D5', FOG_NEAR, fogFar]} />

      {/* Vibrant Golden Hour Sky with Warm Sunset Horizon */}
      <Sky
        sunPosition={[70, 24, 70]}
        inclination={0.52}
        azimuth={0.32}
        turbidity={3.2}
        rayleigh={0.55}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Ambient & Hemisphere Lighting for Rich Botanical Shadows */}
      <ambientLight intensity={0.72} color="#FFF8E8" />
      <hemisphereLight args={['#FFF1D0', '#3A5A40', 0.68]} />

      {/* Warm Directional Sunlight Casting Soft Long Shadows */}
      <directionalLight
        position={[32, 36, 28]}
        intensity={1.5}
        color="#FFF2D6"
        castShadow={profile.shadowsEnabled}
        shadow-mapSize={[profile.shadowMapSize, profile.shadowMapSize]}
        shadow-camera-far={85}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />

      {/* Cool Sky Fill Light to enrich shaded greenery */}
      <directionalLight position={[-18, 16, -18]} intensity={0.4} color="#C4E0E5" />

      {/* Natural Sculpted Terrain with Stepping Stone Paths */}
      <Terrain />

      {/* Wildflower & Lavender Fields with Interactive Flower Picking */}
      <FlowerFields
        onPickFlower={onPickFlower}
        onRegisterObjects={onRegisterObjects}
      />

      {/* Interactive Plant Pots & Botanical Nursery Lifecycle System */}
      <InteractivePots
        onWaterPlant={onWaterPlant}
        onRegisterObjects={onRegisterObjects}
      />

      {/* Living Autonomous Bloom Companion Character */}
      <BloomCompanion
        bloomState={bloomState}
        onOpenChat={onOpenChat}
        onRegisterObject={onRegisterSingleObject}
        playerPositionRef={playerPositionRef}
      />

      {/* Physical Navigation Wall & Gateway Monument */}
      <NavigationWall />

      {/* Rich Zone Landmarks (Entrance Arch, Lotus Pond, Pine Grove Bench, Bloom's Blossom Tree) */}
      <EnvironmentProps
        onRegisterObjects={onRegisterObjects}
        onSitBench={onSitBench}
        onTouchWater={onTouchWater}
        onTriggerDiscovery={onTriggerDiscovery}
      />

      {/* Enclosing Horizon Forest Silhouettes */}
      <group>
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const rad = 32 + Math.sin(i * 3) * 3;
          const hx = Math.cos(angle) * rad;
          const hz = Math.sin(angle) * rad;
          const hy = getTerrainHeight(hx, hz);
          const scale = 1.3 + (i % 3) * 0.3;

          return (
            <group key={`horizon-tree-${i}`} position={[hx, hy, hz]} scale={scale}>
              <mesh position={[0, 2.2, 0]}>
                <coneGeometry args={[1.4, 4.5, 6]} />
                <meshStandardMaterial color="#243E23" roughness={0.9} />
              </mesh>
              <mesh position={[0, 4.0, 0]} scale={0.75}>
                <coneGeometry args={[1.3, 3.8, 6]} />
                <meshStandardMaterial color="#2E4F2D" roughness={0.9} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Drifting Golden Pollen & Blossom Particles */}
      <Atmosphere particleCount={profile.particleCount} />
    </>
  );
}

