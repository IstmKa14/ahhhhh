'use client';

// Terrain: the flat ground plane for the Garden.
// Low poly (1 segment) for Phase 1 performance.
// Phase 9 can add a height map or more segments.

import { TERRAIN_SIZE, TERRAIN_SEGMENTS } from '../constants/garden.constants';

export function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS]} />
      <meshStandardMaterial color="#7A9E7E" roughness={0.9} metalness={0} />
    </mesh>
  );
}
