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

export type InteractableType =
  | 'flower'
  | 'plant'
  | 'seed'
  | 'watering_can'
  | 'pond'
  | 'bench'
  | 'bloom'
  | 'tree'
  | 'journal_object'
  | 'resource_object';

export interface InteractiveObjectConfig {
  id: string;
  type: InteractableType;
  position: [number, number, number];
  interactionRadius: number;
  promptLabel: string;
  onInteract: () => void;
}

export type BloomState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'curious'
  | 'resting';

export interface PlayerState {
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
}

export interface VelocityVector {
  x: number;
  z: number;
}
