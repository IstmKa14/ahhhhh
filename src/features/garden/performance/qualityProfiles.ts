// Quality profile definitions for the Garden renderer.
// Each profile sets rendering parameters. The canvas reads these at mount
// and re-applies when the user switches quality level.

import type { QualityLevel, QualityProfile } from '../types/garden.types';

// devicePixelRatio is only available client side.
// These are evaluated lazily inside the hook, not at module load time.
export function getQualityProfiles(): Record<QualityLevel, QualityProfile> {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  return {
    low: {
      shadowMapSize: 512,
      pixelRatio: 1,
      particleCount: 0,
      fogDensity: 0.02,
      shadowsEnabled: false,
      antialias: false,
    },
    medium: {
      shadowMapSize: 1024,
      pixelRatio: Math.min(dpr, 1.5),
      particleCount: 20,
      fogDensity: 0.015,
      shadowsEnabled: true,
      antialias: true,
    },
    high: {
      shadowMapSize: 2048,
      pixelRatio: Math.min(dpr, 2),
      particleCount: 60,
      fogDensity: 0.012,
      shadowsEnabled: true,
      antialias: true,
    },
  };
}
