// Garden feature constants.
// Never hardcode values directly in components. All tuneable values live here.

import type { QualityLevel } from '../types/garden.types';

export const PLAYER_SPEED = 4; // world units per second
export const CAMERA_HEIGHT_OFFSET = 3; // units above player
export const CAMERA_DISTANCE = 6; // units behind player
export const CAMERA_LERP_FACTOR = 0.08; // 0 = no follow, 1 = instant snap
export const INTERACTION_RADIUS = 2.5; // world units
export const TERRAIN_SIZE = 60; // square terrain side length
export const TERRAIN_SEGMENTS = 1; // low poly flat terrain
export const QUALITY_STORAGE_KEY = 'mindbloom_quality';
export const DEFAULT_QUALITY: QualityLevel = 'medium';

// Joystick force threshold below which movement is ignored
export const JOYSTICK_DEAD_ZONE = 0.1;

// The player capsule placeholder dimensions
export const PLAYER_CAPSULE_RADIUS = 0.35;
export const PLAYER_CAPSULE_HEIGHT = 0.7;

// Fog near and far distances per quality level (used by scene fog)
export const FOG_NEAR = 20;
export const FOG_FAR_LOW = 40;
export const FOG_FAR_MEDIUM = 55;
export const FOG_FAR_HIGH = 70;
