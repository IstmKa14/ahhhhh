'use client';

// Terrain: rich, colorful sculpted natural landscape with distinct color zones,
// stone and gravel paths, flower meadows, and exact analytical height synchronization.

import { useMemo } from 'react';
import * as THREE from 'three';
import { TERRAIN_SIZE } from '../constants/garden.constants';
import { getTerrainHeight } from '../utils/terrainMath';

export function Terrain() {
  const { geometry, stonePathTransforms, gravelTransforms } = useMemo(() => {
    const segments = 80;
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const vertex = new THREE.Vector3();

    // Vibrant Biome Colors
    const colorLush = new THREE.Color('#4F7942');       // Deep emerald lawn
    const colorMeadow = new THREE.Color('#608A4E');     // Bright sunny meadow
    const colorLavenderGrass = new THREE.Color('#586C54'); // Muted sage lavender lawn
    const colorPathEdge = new THREE.Color('#8B7355');   // Rich warm fertile soil
    const colorPerimeter = new THREE.Color('#385633');  // Deep woods perimeter

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const x = vertex.x;
      const z = vertex.z;

      const y = getTerrainHeight(x, z);
      pos.setY(i, y);

      // Color zoning based on location in the world
      const pathDist = Math.abs(x - Math.sin(z * 0.15) * 4);
      let mixedColor = colorMeadow.clone();

      if (pathDist < 1.4) {
        mixedColor.lerp(colorPathEdge, 0.6);
      } else if (x > 4 && z < -4) {
        // Lavender & Bench area
        mixedColor.lerp(colorLavenderGrass, 0.7);
      } else if (x < -3 && z > 2) {
        // Pink flower grove
        mixedColor.lerp(colorLush, 0.8);
      } else {
        mixedColor.lerp(colorMeadow, 0.5);
      }

      // Darker woods at the perimeter
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 18) {
        mixedColor.lerp(colorPerimeter, Math.min(1, (dist - 18) / 10));
      }

      colors[i * 3 + 0] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    // Stepping stones along main winding pathway
    const stones: { position: [number, number, number]; scale: [number, number, number]; rotY: number; color: string }[] = [];
    const gravel: { position: [number, number, number]; scale: [number, number, number] }[] = [];

    for (let z = 18; z >= -20; z -= 1.3) {
      const targetX = Math.sin(z * 0.15) * 4 + (Math.sin(z * 3.7) * 0.3);
      const groundY = getTerrainHeight(targetX, z);
      stones.push({
        position: [targetX, groundY + 0.04, z],
        scale: [0.75 + Math.sin(z) * 0.15, 0.08, 0.65 + Math.cos(z * 2) * 0.1],
        rotY: Math.sin(z * 5) * 0.4,
        color: z % 2 === 0 ? '#A49F96' : '#8E887E',
      });

      // Scatter path gravel
      const gx = targetX + (Math.sin(z * 8) * 0.6);
      const gz = z + (Math.cos(z * 7) * 0.4);
      gravel.push({
        position: [gx, getTerrainHeight(gx, gz) + 0.02, gz],
        scale: [0.18, 0.04, 0.18],
      });
    }

    return { geometry: geo, stonePathTransforms: stones, gravelTransforms: gravel };
  }, []);

  return (
    <group>
      {/* Dynamic Colored Terrain */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.82}
          metalness={0.03}
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
