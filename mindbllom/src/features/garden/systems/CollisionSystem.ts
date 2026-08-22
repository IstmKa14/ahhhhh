// Lightweight spatial collision system for MindBloom Garden.
// Prevents player and camera from walking through tree trunks, large boulders,
// sanctuary arch posts, and garden structures without expensive physics engines.

export interface CylinderObstacle {
  x: number;
  z: number;
  radius: number;
}

export interface BoxObstacle {
  x: number;
  z: number;
  halfWidth: number;
  halfDepth: number;
  rotationY?: number;
}

// Sanctuary Obstacle Map
export const STATIC_OBSTACLES: CylinderObstacle[] = [
  // Mature Pine Grove Trees
  { x: 12, z: -11, radius: 0.65 },
  { x: 15, z: -8, radius: 0.55 },
  { x: 10, z: -15, radius: 0.6 },
  // Pond Perimeter Trees
  { x: -14, z: -10, radius: 0.65 },
  { x: -12, z: -16, radius: 0.65 },
  // Meadow & Perimeter Trees
  { x: -14, z: 6, radius: 0.55 },
  { x: 14, z: 12, radius: 0.55 },
  { x: -12, z: 16, radius: 0.5 },
  { x: 12, z: 16, radius: 0.5 },
  { x: 16, z: -2, radius: 0.55 },
  // Bloom's Grand Blossom Tree
  { x: 2.2, z: -2.2, radius: 0.75 },
  // Archway Posts
  { x: -2.2, z: 17, radius: 0.35 },
  { x: 2.2, z: 17, radius: 0.35 },
  // Stone Pagoda Lanterns
  { x: 10, z: -9, radius: 0.4 },
  { x: -1.5, z: -4, radius: 0.4 },
  { x: -7, z: -10, radius: 0.4 },
];

export const BOX_OBSTACLES: BoxObstacle[] = [
  // Navigation Wall Base
  { x: -0.5, z: 15, halfWidth: 2.4, halfDepth: 0.5 },
  // Botanical Plant Table
  { x: 7.2, z: 7.8, halfWidth: 2.2, halfDepth: 0.9 },
  // Grove Bench
  { x: 12, z: -11, halfWidth: 1.1, halfDepth: 0.4 },
  // Haven Bench
  { x: 3.8, z: -3.2, halfWidth: 0.9, halfDepth: 0.35 },
];

/**
 * Resolves player position against static sanctuary obstacles using soft sliding repulsion.
 */
export function resolvePlayerCollisions(
  currentX: number,
  currentZ: number,
  playerRadius = 0.35
): { x: number; z: number } {
  let resolvedX = currentX;
  let resolvedZ = currentZ;

  // Resolve Cylinder Obstacles
  for (const obs of STATIC_OBSTACLES) {
    const dx = resolvedX - obs.x;
    const dz = resolvedZ - obs.z;
    const distSq = dx * dx + dz * dz;
    const minDist = obs.radius + playerRadius;

    if (distSq < minDist * minDist && distSq > 0.0001) {
      const dist = Math.sqrt(distSq);
      const overlap = minDist - dist;
      resolvedX += (dx / dist) * overlap;
      resolvedZ += (dz / dist) * overlap;
    }
  }

  // Resolve Box Obstacles
  for (const box of BOX_OBSTACLES) {
    const minX = box.x - box.halfWidth - playerRadius;
    const maxX = box.x + box.halfWidth + playerRadius;
    const minZ = box.z - box.halfDepth - playerRadius;
    const maxZ = box.z + box.halfDepth + playerRadius;

    if (resolvedX > minX && resolvedX < maxX && resolvedZ > minZ && resolvedZ < maxZ) {
      // Find shortest penetration depth to push player out
      const distLeft = resolvedX - minX;
      const distRight = maxX - resolvedX;
      const distTop = resolvedZ - minZ;
      const distBottom = maxZ - resolvedZ;

      const minDist = Math.min(distLeft, distRight, distTop, distBottom);

      if (minDist === distLeft) resolvedX = minX;
      else if (minDist === distRight) resolvedX = maxX;
      else if (minDist === distTop) resolvedZ = minZ;
      else resolvedZ = maxZ;
    }
  }

  return { x: resolvedX, z: resolvedZ };
}
