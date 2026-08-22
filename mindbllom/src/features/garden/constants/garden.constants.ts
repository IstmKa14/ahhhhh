// Garden feature constants.
// Never hardcode values directly in components. All tuneable values live here.

import type { QualityLevel, GardenZoneId } from '../types/garden.types';

export const PLAYER_SPEED = 4.8; // world units per second
export const CAMERA_HEIGHT_OFFSET = 3.2; // units above player
export const CAMERA_DISTANCE = 5.8; // units behind player
export const CAMERA_LERP_FACTOR = 0.08; // 0 = no follow, 1 = instant snap
export const INTERACTION_RADIUS = 2.4; // world units
export const TERRAIN_SIZE = 72; // square terrain side length
export const QUALITY_STORAGE_KEY = 'mindbloom_quality';
export const DEFAULT_QUALITY: QualityLevel = 'medium';

// Joystick force threshold below which movement is ignored
export const JOYSTICK_DEAD_ZONE = 0.1;

// Fog near and far distances per quality level (used by scene fog)
export const FOG_NEAR = 28;
export const FOG_FAR_LOW = 45;
export const FOG_FAR_MEDIUM = 65;
export const FOG_FAR_HIGH = 85;

// Garden Zone Center Coordinates & Meta
export interface ZoneMeta {
  id: GardenZoneId;
  name: string;
  subtitle: string;
  center: [number, number]; // [x, z]
  radius: number;
  color: string;
}

export const GARDEN_ZONES: ZoneMeta[] = [
  {
    id: 'entrance',
    name: 'Sanctuary Gate',
    subtitle: 'Gateway to MindBloom',
    center: [0, 16],
    radius: 7,
    color: '#81B29A',
  },
  {
    id: 'bloom_place',
    name: "Bloom's Haven",
    subtitle: "Ancient Blossom Tree & Bloom's Home",
    center: [2, -2],
    radius: 7.5,
    color: '#F28DA8',
  },
  {
    id: 'meadow',
    name: 'Wildflower Meadow',
    subtitle: 'Vibrant Lavender, Tulips & Daisies',
    center: [-10, 3],
    radius: 8.5,
    color: '#FFCA3A',
  },
  {
    id: 'botanical',
    name: 'Botanical Nursery',
    subtitle: 'Interactive Planters & Plant Growth',
    center: [7, 7],
    radius: 7.5,
    color: '#52B788',
  },
  {
    id: 'pond',
    name: 'Serene Lotus Pond',
    subtitle: 'Gentle Ripples & Stepping Stones',
    center: [-9, -13],
    radius: 7.5,
    color: '#4CC9F0',
  },
  {
    id: 'grove',
    name: 'Whispering Pine Grove',
    subtitle: 'Secluded Bench & Mindful Breathing',
    center: [12, -11],
    radius: 8.0,
    color: '#6A4E38',
  },
];

