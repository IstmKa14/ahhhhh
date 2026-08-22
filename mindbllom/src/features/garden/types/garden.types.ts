// Garden feature types.
// Never use `any`. All types for the Garden feature live here.

export type QualityLevel = 'low' | 'medium' | 'high';

export interface QualityProfile {
  shadowMapSize: number;
  pixelRatio: number;
  particleCount: number;
  fogDensity: number;
  shadowsEnabled: boolean;
  antialias: boolean;
}

export type GardenZoneId =
  | 'entrance'
  | 'meadow'
  | 'botanical'
  | 'pond'
  | 'grove'
  | 'bloom_place';

export type InteractableType =
  | 'flower'
  | 'plant'
  | 'seed'
  | 'watering_can'
  | 'pot'
  | 'pond'
  | 'bench'
  | 'bloom'
  | 'tree'
  | 'nav_wall'
  | 'sign';

export interface InteractiveObjectConfig {
  id: string;
  type: InteractableType;
  position: [number, number, number];
  interactionRadius: number;
  promptLabel: string;
  actionKey?: string;
  onInteract: () => void;
}

export type BloomState =
  | 'idle'
  | 'wandering'
  | 'inspecting_flower'
  | 'resting_bench'
  | 'looking_at_pond'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'celebrating';

export type PlantGrowthStage = 'seed' | 'sprout' | 'growing' | 'blooming';

export interface PlantPotData {
  id: string;
  position: [number, number, number];
  stage: PlantGrowthStage;
  waterLevel: number; // 0 to 100
  flowerColor: string;
  plantName: string;
}

export interface PickableFlowerData {
  id: string;
  position: [number, number, number];
  flowerType: 'tulip' | 'daisy' | 'lavender' | 'wildflower' | 'cosmos' | 'peony';
  color: string;
  isPicked: boolean;
  name: string;
}

export interface PlayerState {
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
  isSitting: boolean;
  sittingTarget?: [number, number, number];
}

export interface VelocityVector {
  x: number;
  z: number;
}

export interface BloomChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface BloomGardenContext {
  currentZone: GardenZoneId;
  zoneName: string;
  isSitting: boolean;
  flowersPickedCount: number;
  nearbyObjectName?: string;
  recentAction?: string;
}

