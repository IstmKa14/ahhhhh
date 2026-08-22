// Exact analytical ground height sampling utility
// Synchronizes mesh geometry, player walking, Bloom wandering, and prop placement
// Eliminates all z-fighting, sinking feet, and floating objects

export function getTerrainHeight(x: number, z: number): number {
  const distFromCenter = Math.sqrt(x * x + z * z);
  
  // Gentle rolling mounds
  const hillNoise1 = Math.sin(x * 0.1) * Math.cos(z * 0.08) * 0.8;
  const hillNoise2 = Math.cos(x * 0.05 + 1.2) * Math.sin(z * 0.06) * 1.2;

  // Path depression damping
  const pathDist = Math.abs(x - Math.sin(z * 0.15) * 4);
  const pathDampen = Math.min(1, Math.max(0, (pathDist - 1.5) / 4));

  // Perimeter ridge to enclose the garden sanctuary
  const perimeterRise = Math.pow(Math.max(0, (distFromCenter - 18) / 12), 2) * 2.5;

  // Pond depression centered at [-6, -13] with 4.5 radius
  const pondDx = x - (-6);
  const pondDz = z - (-13);
  const pondDist = Math.sqrt(pondDx * pondDx + pondDz * pondDz);
  const pondDip = pondDist < 4.5 ? -Math.cos((pondDist / 4.5) * (Math.PI / 2)) * 0.65 : 0;

  return (hillNoise1 + hillNoise2) * pathDampen * 0.4 + perimeterRise + pondDip;
}
