'use client';

// GardenScene: Composes Japanese-botanical garden aesthetic with warm late-afternoon sunlight,
// layered forest horizon, organic sculpted terrain, rich environmental props, and ambient pollen atmosphere.

import { Sky } from '@react-three/drei';
import { Terrain } from './Terrain';
import { EnvironmentProps } from './EnvironmentProps';
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
      {/* Soft Cinematic Atmospheric Fog blending into the horizon */}
      <fog attach="fog" args={['#D8E2DC', FOG_NEAR, fogFar]} />

      {/* Warm Golden Hour Sky */}
      <Sky
        sunPosition={[60, 24, 80]}
        inclination={0.52}
        azimuth={0.35}
        turbidity={4}
        rayleigh={0.65}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Ambient & Hemisphere Lighting for Rich Botanical Shadows */}
      <ambientLight intensity={0.65} color="#FFF7EC" />
      <hemisphereLight args={['#FAF3DD', '#4A5B43', 0.55]} />

      {/* Warm Directional Sunlight Casting Soft Long Shadows */}
      <directionalLight
        position={[25, 30, 25]}
        intensity={1.35}
        color="#FFF2D6"
        castShadow={profile.shadowsEnabled}
        shadow-mapSize={[profile.shadowMapSize, profile.shadowMapSize]}
        shadow-camera-far={70}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Cool Sky Fill Light to enrich shaded greenery */}
      <directionalLight position={[-15, 12, -15]} intensity={0.35} color="#BEE3DB" />

      {/* Natural Sculpted Terrain with Stepping Stone Paths */}
      <Terrain />

      {/* Rich Layered Trees, Pond, Bench, Botanical Flowers & Props */}
      <EnvironmentProps onRegisterObjects={onRegisterObjects} />

      {/* Drifting Golden Pollen Particles */}
      <Atmosphere particleCount={profile.particleCount} />
    </>
  );
}
