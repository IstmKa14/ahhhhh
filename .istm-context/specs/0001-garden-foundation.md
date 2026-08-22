# Spec 0001: R3F + Garden Foundation

**Feature:** R3F + Garden foundation
**Phase:** 1
**Status:** planned
**Scope row:** `.istm-context/istm-scope/istm-scope.md` — Feature 1

---

## Summary

This spec covers the installation of React Three Fiber, @react-three/drei, and Three.js, and the construction of a performant, extensible 3D Garden scene foundation. It is the walking skeleton of MindBloom's 3D world. Every later Garden feature (Bloom 3D, interactions, planting, persistence) builds on top of exactly what this spec puts in place.

Nothing is faked or stubbed. The scene, the player, the controls, and the performance architecture are all real from day one.

---

## Acceptance Criteria

1. `/garden` loads without error and renders a 3D scene containing: flat terrain, ambient and directional lighting, a sky, and placeholder geometry objects (rocks, bushes) as interactive object stubs.
2. A player capsule moves through the scene using WASD (desktop) and a virtual joystick (mobile). Movement feels smooth and calm, not fast or jerky.
3. The camera follows the player with a lerp spring. There is a noticeable but gentle lag so it never feels snapped.
4. The Garden page uses its own Next.js layout that hides the global Header and Footer. The immersive view has no external chrome.
5. The canvas (`GardenCanvas`) and React UI (`GardenUI`) are separate components. Chat, controls, prompts, and HUD elements live in `GardenUI`. Nothing is rendered as Three.js text.
6. A quality system with three named profiles (Low, Medium, High) is in place. Quality preference persists in `localStorage`. A settings toggle in `GardenUI` lets the user switch profiles.
7. `InteractionDetector` is wired: objects tagged as interactive emit an `onInteract` callback when the player enters their interaction radius. A `InteractionPrompt` component in `GardenUI` shows a subtle contextual label near the screen center when an object is within range.
8. The scene renders at a stable 60 fps on a mid range desktop and at an acceptable frame rate on a mid range Android device at Low quality.
9. WebGL unavailability is caught at the canvas level and the component renders a graceful error boundary (a warm text message, not a broken page).
10. `nipplejs` is installed and the virtual joystick appears on touch devices. It is hidden on desktop.

---

## Architecture

### New Dependencies

```
three
@react-three/fiber
@react-three/drei
nipplejs
@types/three
```

No other new dependencies are introduced in this phase.

### Folder Structure

All Garden code lives under a strict feature boundary. Nothing in this spec touches `src/app/chat`, `src/app/journal`, or any other existing feature.

```
src/
  app/
    garden/
      layout.tsx          ← Garden layout (no Header, no Footer)
      page.tsx            ← Thin page: renders <GardenExperience />
  features/
    garden/
      components/
        GardenExperience.tsx   ← Composes GardenCanvas + GardenUI
        GardenCanvas.tsx       ← R3F Canvas + scene
        GardenUI.tsx           ← React HUD layer (controls, prompt, settings)
        InteractionPrompt.tsx  ← Contextual label shown when near an object
        QualityToggle.tsx      ← Quality level switcher (Low / Medium / High)
        MobileControls.tsx     ← nipplejs virtual joystick wrapper
      scene/
        GardenScene.tsx        ← Three.js scene content (fog, sky, terrain)
        Terrain.tsx            ← Ground plane geometry + material
        Sky.tsx                ← Lightweight sky (gradient or simple mesh)
        PlaceholderObjects.tsx ← Stub rocks/bushes as InteractiveObject markers
      player/
        Player.tsx             ← Player capsule + WASD logic + position state
        usePlayerMovement.ts   ← Hook: keyboard input → velocity → position
        useMobileMovement.ts   ← Hook: nipplejs input → velocity
        useFollowCamera.ts     ← Hook: lerp spring camera follow
      systems/
        InteractionDetector.tsx  ← Proximity detector; fires onInteract
        useInteractionSystem.ts  ← Hook: tracks nearest interactive object
        PerformanceMonitor.tsx   ← r3f-perf or custom FPS/draw call tracker
      performance/
        qualityProfiles.ts     ← Low / Medium / High profile config objects
        useQualityLevel.ts     ← Hook: reads/writes quality from localStorage
      types/
        garden.types.ts        ← All Garden types; no inline type definitions
      constants/
        garden.constants.ts    ← Movement speed, camera offsets, interaction radius, quality defaults
      index.ts               ← Re-exports public surface (GardenExperience, types)
```

### Type Definitions (`garden.types.ts`)

```typescript
export type QualityLevel = 'low' | 'medium' | 'high';

export interface QualityProfile {
  shadowMapSize: number;
  pixelRatio: number;
  particleCount: number;
  fogDensity: number;
  shadowsEnabled: boolean;
  antialias: boolean;
}

export interface InteractiveObjectConfig {
  id: string;
  type: InteractableType;
  position: [number, number, number];
  interactionRadius: number;
  promptLabel: string;
  onInteract: () => void;
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
```

### Constants (`garden.constants.ts`)

```typescript
export const PLAYER_SPEED = 4; // units per second
export const PLAYER_SPRINT_MULTIPLIER = 1; // no sprint in wellness mode
export const CAMERA_HEIGHT_OFFSET = 3;
export const CAMERA_DISTANCE = 6;
export const CAMERA_LERP_FACTOR = 0.08; // 0 = no follow, 1 = instant snap
export const INTERACTION_RADIUS = 2.5; // world units
export const TERRAIN_SIZE = 60;
export const TERRAIN_SEGMENTS = 1;
export const QUALITY_STORAGE_KEY = 'mindbloom_quality';
export const DEFAULT_QUALITY: QualityLevel = 'medium';
```

### Quality Profiles (`qualityProfiles.ts`)

```typescript
import type { QualityProfile, QualityLevel } from '../types/garden.types';

export const QUALITY_PROFILES: Record<QualityLevel, QualityProfile> = {
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
    pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    particleCount: 20,
    fogDensity: 0.015,
    shadowsEnabled: true,
    antialias: true,
  },
  high: {
    shadowMapSize: 2048,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    particleCount: 60,
    fogDensity: 0.012,
    shadowsEnabled: true,
    antialias: true,
  },
};
```

Note: `window.devicePixelRatio` is only read client side. The hook guards this safely.

---

## Garden Layout

The Garden needs its own Next.js layout that opts out of the global `Header` and `Footer`.

**`src/app/garden/layout.tsx`:**

```typescript
export default function GardenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {children}
    </div>
  );
}
```

The global `layout.tsx` at the root still wraps `AuthProvider` and `Toaster`. The Garden layout sits below it. Only the Garden-specific shell (no Header, no Footer, full viewport) is scoped here.

---

## Component Contracts

### `GardenExperience`

Top level composition component. Owns no state itself. Renders `GardenCanvas` and `GardenUI` as sibling layers using absolute positioning.

```tsx
<div className="relative h-full w-full">
  <GardenCanvas quality={quality} interactiveObjects={objects} />
  <GardenUI
    quality={quality}
    onQualityChange={setQuality}
    nearestPrompt={nearestPrompt}
    isMobile={isMobile}
  />
</div>
```

### `GardenCanvas`

The R3F `<Canvas>` component. Receives the quality profile and interactive objects as props. Never imports React UI components. Renders the full Three.js scene.

Key R3F Canvas config:
```tsx
<Canvas
  shadows={profile.shadowsEnabled}
  dpr={profile.pixelRatio}
  camera={{ fov: 60, near: 0.1, far: 200 }}
  gl={{ antialias: profile.antialias }}
>
```

Contains:
- `<GardenScene />` (fog, ambient, directional light, sky, terrain, placeholder objects)
- `<Player />` (capsule mesh, movement, position state lifted via ref/context)
- `<InteractionDetector />` (proximity system)
- `<PerformanceMonitor />` (dev only, stripped in production)

### `GardenUI`

A `position: absolute; inset: 0; pointer-events: none` div sitting above the canvas. Individual interactive elements re-enable pointer events where needed (`pointer-events: auto`).

Contains:
- `<InteractionPrompt />` — shown when `nearestPrompt` is not null
- `<QualityToggle />` — bottom right corner, small and unobtrusive
- `<MobileControls />` — bottom left, visible on touch devices only

### `Player`

Uses `useFrame` from R3F to update position each frame. Movement velocity comes from `usePlayerMovement` (keyboard) or `useMobileMovement` (nipplejs). Position is shared via a React ref so `useFollowCamera` can read it without triggering a re-render.

```typescript
// Player does NOT use React state for position — position changes happen
// inside useFrame only. This is the standard R3F pattern for game objects.
const positionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
```

### `useFollowCamera`

Uses `useFrame` to lerp the Three.js camera toward a target position computed from the player's position + the camera height and distance constants. The lerp factor is `CAMERA_LERP_FACTOR` from constants.

```typescript
useFrame(({ camera }) => {
  const target = new THREE.Vector3(
    playerPosition.x,
    playerPosition.y + CAMERA_HEIGHT_OFFSET,
    playerPosition.z + CAMERA_DISTANCE,
  );
  camera.position.lerp(target, CAMERA_LERP_FACTOR);
  camera.lookAt(playerPosition.x, playerPosition.y + 1, playerPosition.z);
});
```

### `InteractionDetector`

Runs inside `useFrame`. Iterates the `interactiveObjects` list each frame, computes the distance from the player position to each object's position, and tracks the nearest object within `INTERACTION_RADIUS`. Calls `onNearestChange(object | null)` when the nearest object changes. This callback is passed up and used to update the UI prompt without causing a re-render every frame (the callback only fires on change).

### `MobileControls` and `useMobileMovement`

`MobileControls` mounts a `nipplejs` joystick on a touch-only element. The joystick emits `move` and `end` events. `useMobileMovement` converts the joystick angle and force into an `{x, z}` velocity vector exposed as a ref (not state, same reason as player position).

---

## Garden Scene (Phase 1 Geometry Only)

No GLB or GLTF assets. All geometry is Three.js primitives.

| Element | Geometry | Notes |
|---|---|---|
| Terrain | `PlaneGeometry(60, 60)` | Rotated flat, soft green material |
| Sky | `<Sky>` from drei | Adjustable sun position for warm tone |
| Ambient light | `<ambientLight intensity={0.6}>` | Warm tone |
| Directional light | `<directionalLight castShadow>` | Soft shadows if quality allows |
| Rocks (x4) | `SphereGeometry` slightly deformed | Gray matte material |
| Bushes (x6) | `SphereGeometry` with slight squash | Muted green |
| Placeholder pond | `CircleGeometry` | Blue tinted flat mesh, no shader yet |
| Placeholder bench | `BoxGeometry` | Brown matte, tagged as interactive |

All placeholder objects are wrapped in `InteractiveObjectConfig` so Phase 5 can replace the geometry with real interactions without changing the system.

---

## Performance Architecture

These patterns are established in Phase 1 so every later phase inherits them.

### Pattern: no state for per-frame values

Player position, camera position, joystick vectors, and interaction distance all live in refs and are updated inside `useFrame`. They never go into React state. This prevents R3F from triggering React re-renders every frame.

### Pattern: InstancedMesh for repeated objects

Rocks and bushes use `InstancedMesh` even in Phase 1. Each type is a single draw call. Later phases follow this pattern.

### Pattern: distance based visibility

A `useDistanceCull` utility (a simple hook) is established in Phase 1. It reads the player position and the object position, and returns a boolean. Objects use it to set `visible={isNear}`. Phase 2 objects use this for animation culling.

### Pattern: quality controlled rendering

The canvas `dpr`, `shadows`, and `antialias` are driven by the quality profile. Low quality removes shadows entirely and halves the pixel ratio. This is wired in Phase 1 so every later visual addition respects it automatically.

---

## Route and Navigation

A link to the Garden is added to the existing `Header` component as a navigation item.

```
/garden  →  Garden experience
```

The Garden page is protected by auth. If the user is not authenticated, redirect to `/login`. This uses the same auth pattern as the existing protected routes.

---

## Error Boundaries

The R3F `<Canvas>` is wrapped in a React Error Boundary. If WebGL is unavailable or Three.js throws on init, the boundary catches it and renders a warm fallback message. This is the foundation for the full Accessibility and WebGL Fallback spec (Feature 10).

```tsx
<GardenErrorBoundary>
  <GardenCanvas ... />
</GardenErrorBoundary>
```

The `GardenErrorBoundary` renders:

```
Your browser does not support the 3D Garden.
You can still talk to Bloom, journal, and explore resources.
[Go to dashboard]
```

---

## Styling Rules

The `GardenUI` React layer uses the existing design tokens from `design.md` and `globals.css`.

- Background tokens: `bg-background`, `bg-card`, `bg-surface-muted`
- Text tokens: `text-foreground`, `text-muted-foreground`
- Border tokens: `border-border`
- Font: `font-body` (Inter) for all UI labels, prompts, and controls
- No hardcoded hex values in any component

The quality toggle and interaction prompt are subtle and use low opacity backgrounds (`bg-black/30` or a card token with low opacity) so they do not visually compete with the Garden.

---

## Build Plan

### Step 1: Install dependencies

```bash
npm install three @react-three/fiber @react-three/drei nipplejs
npm install --save-dev @types/three @types/nipplejs
```

Verify the R3F and Next.js versions are compatible. R3F v8+ supports React 19 and Next.js App Router with client components. Every file using R3F hooks or the Canvas must have `'use client'` at the top.

### Step 2: Create types and constants

Create `src/features/garden/types/garden.types.ts` with all type definitions from this spec.
Create `src/features/garden/constants/garden.constants.ts` with all constants from this spec.
No logic yet. Types and constants only.

### Step 3: Quality system

Create `src/features/garden/performance/qualityProfiles.ts`.
Create `src/features/garden/performance/useQualityLevel.ts`.

`useQualityLevel` reads from `localStorage` on mount. Writes to `localStorage` on change. Returns `{ quality, setQuality, profile }`. Defaults to `DEFAULT_QUALITY` if nothing is stored.

### Step 4: Garden layout and route

Create `src/app/garden/layout.tsx`. Full viewport, no Header, no Footer.
Create `src/app/garden/page.tsx`. Thin page that imports and renders `<GardenExperience />` from the feature folder.

### Step 5: GardenExperience composition

Create `src/features/garden/components/GardenExperience.tsx`.
This component:
- Calls `useQualityLevel`
- Detects `isMobile` via a `window.ontouchstart` or `navigator.maxTouchPoints` check
- Holds `nearestPrompt` state (the nearest interactive object, or null)
- Renders `<GardenCanvas>` and `<GardenUI>` as siblings

### Step 6: Player movement hooks

Create `usePlayerMovement.ts`. Listens to `keydown`/`keyup` events. Returns a `velocityRef` holding `{x: number, z: number}`.
Create `useMobileMovement.ts`. Mounts a nipplejs instance on a given DOM element. Returns a `velocityRef` holding `{x: number, z: number}`.
Create `useFollowCamera.ts`. Uses `useFrame` to lerp the camera toward the player position ref.

### Step 7: Player component

Create `src/features/garden/player/Player.tsx`.
Uses `useFrame` to integrate velocity into position each frame.
Renders a `<mesh>` capsule (CapsuleGeometry) for the player placeholder. The capsule will be replaced by Bloom 3D in Phase 2.
Passes position ref to the camera hook and the interaction detector.

### Step 8: Garden scene

Create `src/features/garden/scene/Terrain.tsx`. Flat plane with muted green material.
Create `src/features/garden/scene/Sky.tsx`. Uses `<Sky>` from drei with a warm sun position.
Create `src/features/garden/scene/PlaceholderObjects.tsx`. Rocks, bushes, pond circle, bench box. Each wrapped in `InteractiveObjectConfig` shape.
Create `src/features/garden/scene/GardenScene.tsx`. Composes lights, terrain, sky, placeholder objects.

### Step 9: Interaction system

Create `useInteractionSystem.ts`. Returns `nearestObject` (or null) by comparing player position to all interactive object positions each frame using a ref, only triggering a state update when the nearest object changes.
Create `InteractionDetector.tsx`. An R3F component that wraps `useInteractionSystem` and exposes `onNearestChange` callback.
Create `InteractionPrompt.tsx`. A React component in `GardenUI` that renders a subtle label in the lower center of the screen when `nearestPrompt` is not null.

### Step 10: GardenCanvas

Create `src/features/garden/components/GardenCanvas.tsx`.
Wire the Canvas with quality profile config.
Compose `<GardenScene>`, `<Player>`, `<InteractionDetector>`, and a dev-only `<PerformanceMonitor>`.

### Step 11: GardenUI

Create `src/features/garden/components/GardenUI.tsx`.
Render `<InteractionPrompt>`, `<QualityToggle>`, and `<MobileControls>` as absolute positioned React elements above the canvas.

### Step 12: MobileControls

Create `src/features/garden/components/MobileControls.tsx`.
Renders a `div` in the bottom left. Mounts the nipplejs joystick on that element. Only renders on touch devices. Hidden on desktop.

### Step 13: Error boundary

Create a `GardenErrorBoundary` class component. Wraps `GardenCanvas` in `GardenExperience`.

### Step 14: Header navigation

Add a Garden link to the existing `src/components/layout/Header.tsx`. Use the existing nav link pattern. No style changes to the Header beyond adding the link.

### Step 15: Feature index

Create `src/features/garden/index.ts`. Re-export `GardenExperience` and the public types.

### Step 16: Verify

Run `npm run typecheck`. Fix all TypeScript errors.
Run `npm run build`. Confirm the build passes.
Visit `/garden` in the browser. Walk around with WASD. Check the joystick on mobile.
Open browser DevTools performance panel. Confirm stable frame rate on Medium quality.

---

## What This Spec Does Not Cover

The following are explicitly out of scope for this spec. They are covered by later phase specs:

- Bloom 3D character or any character model (Phase 2)
- Bloom 2D SVG poses (Phase 2)
- AI chat integration (Phase 3)
- Voice input or output (Phase 4)
- Real flower, pond, or bench interactions (Phase 5)
- Plant growth lifecycle (Phase 6)
- Firestore persistence (Phase 7)
- Journal connection (Phase 8)
- Full quality and mobile optimization pass (Phase 9)
- Accessibility audit and WebGL fallback page (Phase 10)

---

## Notes for `/istm-develop`

- Every file in `src/features/garden/` that uses R3F hooks (`useFrame`, `useThree`) or the Canvas must include `'use client'` at the top.
- Never use `any` types. The `garden.types.ts` file covers all shapes used in this feature.
- Never put business logic inside `src/app/garden/page.tsx`. It imports `GardenExperience` and renders it. Nothing else.
- The `Player` component uses refs for position and velocity, not React state. This is intentional and critical for performance. Do not refactor it to use state.
- `nipplejs` must be instantiated after mount (`useEffect`) and destroyed on unmount. Never instantiate it at module level.
- `three` and `@react-three/fiber` are ES modules. If Next.js build errors on these, add them to `next.config.ts` under `transpilePackages`.
