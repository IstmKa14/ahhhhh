// Exact analytical ground height sampling utility
// Synchronizes mesh geometry, player walking, Bloom wandering, and prop placement
// Eliminates all z-fighting, sinking feet, and floating objects

export function getTerrainHeight(x: number, z: number): number {
  const distFromCenter = Math.sqrt(x * x + z * z);

  // Soft rolling base mounds
  const gentleRoll1 = Math.sin(x * 0.08) * Math.cos(z * 0.07) * 0.6;
  const gentleRoll2 = Math.cos(x * 0.04 + 0.8) * Math.sin(z * 0.05 - 0.4) * 0.8;

  // Botanical flat terrace dampening around Botanical Nursery [7, 7] and Bloom's Haven [2, -2]
  const distBotanical = Math.sqrt((x - 7) ** 2 + (z - 7) ** 2);
  const distBloom = Math.sqrt((x - 2) ** 2 + (z - (-2)) ** 2);
  const terraceDampen = Math.min(
    1,
    Math.max(0.2, (distBotanical - 2) / 6),
    Math.max(0.2, (distBloom - 2) / 6)
  );

  // Perimeter soft rise to enclose the garden sanctuary naturally
  const perimeterRise = Math.pow(Math.max(0, (distFromCenter - 22) / 12), 2) * 2.8;

  // Pond depression centered at [-9, -13] with 4.8 radius
  const pondDx = x - (-9);
  const pondDz = z - (-13);
  const pondDist = Math.sqrt(pondDx * pondDx + pondDz * pondDz);
  const pondDip = pondDist < 4.8 ? -Math.cos((pondDist / 4.8) * (Math.PI / 2)) * 0.75 : 0;

  // Pine Grove elevated gentle hill around [12, -11]
  const groveDx = x - 12;
  const groveDz = z - (-11);
  const groveDist = Math.sqrt(groveDx * groveDx + groveDz * groveDz);
  const groveRise = groveDist < 9 ? Math.cos((groveDist / 9) * (Math.PI / 2)) * 0.55 : 0;

  return (gentleRoll1 + gentleRoll2) * terraceDampen + perimeterRise + pondDip + groveRise;
}

