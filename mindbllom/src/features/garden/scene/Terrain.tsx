'use client';

// Terrain: rich, colorful sculpted natural landscape with distinct color biomes,
// multi-branching stone and gravel path network connecting all 6 zones,
// and exact analytical height synchronization.

import { useMemo } from 'react';
import * as THREE from 'three';
import { TERRAIN_SIZE } from '../constants/garden.constants';
import { getTerrainHeight } from '../utils/terrainMath';

export function Terrain() {
  const { geometry, stonePathTransforms, gravelTransforms } = useMemo(() => {
    const segments = 90;
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const vertex = new THREE.Vector3();

    // Biome Color Palette
    const colorEmerald = new THREE.Color('#4E7D47');     // Lush sanctuary lawns
    const colorSunnyMeadow = new THREE.Color('#68944E'); // Golden sunlit meadow
    const colorLavenderSoil = new THREE.Color('#5E6B56'); // Sage soil
    const colorRichSoil = new THREE.Color('#6E543D');     // Fertile gardening loam
    const colorPondShore = new THREE.Color('#827A68');    // River pebble / silt
    const colorPerimeter = new THREE.Color('#334B2E');    // Deep woods backdrop

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const x = vertex.x;
      const z = vertex.z;

      const y = getTerrainHeight(x, z);
      pos.setY(i, y);

      let mixedColor = colorEmerald.clone();

      // Zone Color Blending
      const distPond = Math.sqrt((x - -9) ** 2 + (z - -13) ** 2);
      const distMeadow = Math.sqrt((x - -10) ** 2 + (z - 3) ** 2);
      const distBotanical = Math.sqrt((x - 7) ** 2 + (z - 7) ** 2);
      const distGrove = Math.sqrt((x - 12) ** 2 + (z - -11) ** 2);
      const distBloom = Math.sqrt((x - 2) ** 2 + (z - -2) ** 2);

      if (distPond < 6.0) {
        mixedColor.lerp(colorPondShore, Math.max(0, 1 - distPond / 6.0));
      } else if (distMeadow < 9.0) {
        mixedColor.lerp(colorSunnyMeadow, Math.max(0, 1 - distMeadow / 9.0));
      } else if (distBotanical < 8.0) {
        mixedColor.lerp(colorRichSoil, Math.max(0, 1 - distBotanical / 8.0) * 0.75);
      } else if (distGrove < 8.5) {
        mixedColor.lerp(colorLavenderSoil, Math.max(0, 1 - distGrove / 8.5) * 0.8);
      } else if (distBloom < 7.0) {
        mixedColor.lerp(colorSunnyMeadow, 0.4);
      }

      // Deep woods edge gradient
      const distCenter = Math.sqrt(x * x + z * z);
      if (distCenter > 22) {
        mixedColor.lerp(colorPerimeter, Math.min(1, (distCenter - 22) / 10));
      }

      colors[i * 3 + 0] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    // Winding Path Network Stepping Stones
    const stones: { position: [number, number, number]; scale: [number, number, number]; rotY: number; color: string }[] = [];
    const gravel: { position: [number, number, number]; scale: [number, number, number] }[] = [];

    // Helper to generate path segment between two 2D points
    const addPathSegment = (x1: number, z1: number, x2: number, z2: number, count: number, curveAmt = 0) => {
      for (let s = 0; s <= count; s++) {
        const t = s / count;
        const perpX = -(z2 - z1);
        const perpZ = (x2 - x1);
        const len = Math.sqrt(perpX * perpX + perpZ * perpZ) || 1;
        const curveOffset = Math.sin(t * Math.PI) * curveAmt;

        const px = x1 + (x2 - x1) * t + (perpX / len) * curveOffset + (Math.sin(s * 3.7) * 0.15);
        const pz = z1 + (z2 - z1) * t + (perpZ / len) * curveOffset + (Math.cos(s * 4.1) * 0.15);
        const py = getTerrainHeight(px, pz);

        stones.push({
          position: [px, py + 0.04, pz],
          scale: [0.75 + Math.sin(s) * 0.12, 0.08, 0.65 + Math.cos(s * 2) * 0.1],
          rotY: Math.sin(s * 5) * 0.5,
          color: s % 2 === 0 ? '#A6A097' : '#938D83',
        });

        // Scatter path gravel
        if (s % 2 === 0) {
          const gx = px + (Math.sin(s * 8) * 0.55);
          const gz = pz + (Math.cos(s * 7) * 0.35);
          gravel.push({
            position: [gx, getTerrainHeight(gx, gz) + 0.02, gz],
            scale: [0.16, 0.04, 0.16],
          });
        }
      }
    };

    // Main arteries connecting the 6 zones:
    // 1. Entrance [0, 16] -> Bloom's Haven [2, -2]
    addPathSegment(0, 16, 2, -2, 14, 1.2);
    // 2. Bloom's Haven [2, -2] -> Wildflower Meadow [-10, 3]
    addPathSegment(2, -2, -10, 3, 11, -1.0);
    // 3. Bloom's Haven [2, -2] -> Botanical Nursery [7, 7]
    addPathSegment(2, -2, 7, 7, 9, 0.8);
    // 4. Bloom's Haven [2, -2] -> Lotus Pond [-9, -13]
    addPathSegment(2, -2, -9, -13, 13, 1.5);
    // 5. Bloom's Haven [2, -2] -> Pine Grove [12, -11]
    addPathSegment(2, -2, 12, -11, 11, -1.2);
    // 6. Lotus Pond [-9, -13] -> Pine Grove [12, -11]
    addPathSegment(-9, -13, 12, -11, 16, -1.8);

    return { geometry: geo, stonePathTransforms: stones, gravelTransforms: gravel };
  }, []);

  return (
    <group>
      {/* Dynamic Colored Terrain */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.84}
          metalness={0.02}
          flatShading={false}
        />
      </mesh>

      {/* Stepping Stones */}
      {stonePathTransforms.map((stone, idx) => (
        <mesh
          key={`stone-${idx}`}
          position={stone.position}
          rotation={[0, stone.rotY, 0]}
          scale={stone.scale}
          receiveShadow
          castShadow
        >
          <cylinderGeometry args={[0.55, 0.62, 0.12, 7]} />
          <meshStandardMaterial
            color={stone.color}
            roughness={0.88}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Gravel accents along path */}
      {gravelTransforms.map((g, idx) => (
        <mesh key={`gravel-${idx}`} position={g.position} scale={g.scale} receiveShadow>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#B0A99F" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

