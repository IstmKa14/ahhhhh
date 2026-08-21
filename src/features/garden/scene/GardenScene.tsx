'use client';

// GardenScene: Composes Japanese-botanical garden aesthetic with warm golden hour sky,
// layered forest horizon, organic sculpted terrain, colorful flower fields,
// interactive planting pots, physical navigation wall monument, and ambient pollen atmosphere.

import { Sky } from '@react-three/drei';
import { Terrain } from './Terrain';
import { FlowerFields } from './FlowerFields';
import { EnvironmentProps } from './EnvironmentProps';
import { InteractivePots } from './InteractivePots';
import { NavigationWall } from './NavigationWall';
import { Atmosphere } from './Atmosphere';
import type { InteractiveObjectConfig, QualityProfile } from '../types/garden.types';
import { FOG_NEAR, FOG_FAR_LOW, FOG_FAR_MEDIUM, FOG_FAR_HIGH } from '../constants/garden.constants';

interface GardenSceneProps {
  profile: QualityProfile;
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
}

function getFogFar(profile: QualityProfile): number {
  if (!profile.shadowsEnabled) return FOG_FAR_LOW;
  if (profile.shadowMapSize <= 1024) return FOG_FAR_MEDIUM;
  return FOG_FAR_HIGH;
}

export function GardenScene({ profile, onRegisterObjects }: GardenSceneProps) {
  const fogFar = getFogFar(profile);

  return (
    <>
      {/* Soft Luminous Atmospheric Fog blending into the horizon */}
      <fog attach="fog" args={['#CDE3D5', FOG_NEAR, fogFar]} />

      {/* Vibrant Golden Hour Sky with Warm Peach Sunset Horizon */}
      <Sky
        sunPosition={[70, 22, 70]}
        inclination={0.52}
        azimuth={0.32}
        turbidity={3.5}
        rayleigh={0.6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Ambient & Hemisphere Lighting for Rich Botanical Shadows */}
      <ambientLight intensity={0.7} color="#FFF8E8" />
      <hemisphereLight args={['#FFF1D0', '#3A5A40', 0.65]} />

      {/* Warm Directional Sunlight Casting Soft Long Shadows */}
      <directionalLight
        position={[28, 32, 24]}
        intensity={1.45}
        color="#FFF2D6"
        castShadow={profile.shadowsEnabled}
        shadow-mapSize={[profile.shadowMapSize, profile.shadowMapSize]}
        shadow-camera-far={75}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-bias={-0.0005}
      />

      {/* Cool Sky Fill Light to enrich shaded greenery */}
      <directionalLight position={[-16, 14, -16]} intensity={0.4} color="#C4E0E5" />

      {/* Natural Sculpted Terrain with Stepping Stone Paths */}
      <Terrain />

      {/* Wildflower & Lavender Fields */}
      <FlowerFields />

      {/* Interactive Plant Pots & Planting Lifecycle System */}
      <InteractivePots />

      {/* Physical Navigation Wall & Gateway Monument */}
      <NavigationWall />

      {/* Rich Layered Trees, Pond, Bench, Botanical Flowers & Props */}
      <EnvironmentProps onRegisterObjects={onRegisterObjects} />

      {/* Drifting Golden Pollen & Blossom Particles */}
      <Atmosphere particleCount={profile.particleCount} />
    </>
  );
}
