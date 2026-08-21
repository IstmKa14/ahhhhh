'use client';

// GardenScene: composes all Three.js scene content.
// Lights, sky, terrain, and placeholder objects.
// This is the only place that knows about scene-level composition.

import { Sky } from '@react-three/drei';
import { Terrain } from './Terrain';
import { PlaceholderObjects } from './PlaceholderObjects';
import type { InteractiveObjectConfig, QualityProfile } from '../types/garden.types';
import { FOG_NEAR, FOG_FAR_LOW, FOG_FAR_MEDIUM, FOG_FAR_HIGH } from '../constants/garden.constants';

interface GardenSceneProps {
  profile: QualityProfile;
  onRegisterObjects: (objects: InteractiveObjectConfig[]) => void;
}

function getFogFar(profile: QualityProfile): number {
  if (!profile.shadowsEnabled) return FOG_FAR_LOW;      // low quality
  if (profile.shadowMapSize <= 1024) return FOG_FAR_MEDIUM; // medium quality
  return FOG_FAR_HIGH;                                   // high quality
}

export function GardenScene({ profile, onRegisterObjects }: GardenSceneProps) {
  const fogFar = getFogFar(profile);

  return (
    <>
      {/* Fog: creates depth and hides the terrain edge */}
      <fog attach="fog" args={['#C8D8C0', FOG_NEAR, fogFar]} />

      {/* Sky: warm afternoon sun position */}
      <Sky
        sunPosition={[100, 20, 100]}
        inclination={0.49}
        azimuth={0.25}
        turbidity={6}
        rayleigh={0.5}
      />

      {/* Ambient light: fills shadows softly */}
      <ambientLight intensity={0.7} color="#FFF5E0" />

      {/* Directional light: primary light source with optional shadows */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        color="#FFF8E7"
        castShadow={profile.shadowsEnabled}
        shadow-mapSize={[profile.shadowMapSize, profile.shadowMapSize]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
      />

      {/* Fill light from opposite side for softer look */}
      <directionalLight position={[-8, 8, -8]} intensity={0.3} color="#D0E8FF" />

      <Terrain />

      <PlaceholderObjects onRegisterObjects={onRegisterObjects} />
    </>
  );
}
