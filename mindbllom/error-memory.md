# Error Memory

This file logs historical bugs, root causes, and their solutions.

## Synchrounous Headers Error in Next.js

* Symptom: A runtime TypeError occurred in RootLayout saying headers().get is not a function.
* Root Cause: In Next.js 15 and 16, the headers utility function is asynchronous and returns a promise. Calling it synchronously throws an error.
* Resolution: We changed RootLayout to an async function and awaited the headers call.

## Missing API Keys causing Flow Failures

* Symptom: Flow execution crashes when environment variables and API keys are missing.
* Root Cause: The application was cloned without local environment configurations.
* Resolution: We wrapped all main flow functions in try catch blocks and returned graceful mock fallbacks.

## Firebase Invalid API Key Error at Module Load

* Symptom: Runtime FirebaseError with message Firebase: Error (auth/invalid-api-key).
* Root Cause: When local environment variables are missing, the Firebase initialization receives undefined or invalid keys. The SDK checks format criteria (e.g. prefix AIzaSy) at startup.
* Resolution: We provided dummy credentials with valid prefixes and wrapped initialization in try catch blocks. We also implemented clean client side mocks inside the authentication and database hooks to fully bypass Firebase when credentials are not found.

## Next.js Server Action Invalid Origin Error

* Symptom: Server action requests fail with a 500 status code and the error "Invalid Server Actions request."
* Root Cause: Next.js verifies the origin header against the host header for Server Actions CSRF protection. In forwarded dev environments like Codespaces, these do not match.
* Resolution: Configured `experimental.serverActions.allowedOrigins` in `next.config.ts` to allow forwarded host wildcards like `*.github.dev` and `*.app.github.dev`.

## Next.js Use Server Export Restriction

* Symptom: Compilation fails with "A 'use server' file can only export async functions, found object."
* Root Cause: Files with the `"use server"` directive at the top are treated as Server Action modules and are only allowed to export async functions.
* Resolution: Removed the `"use server"` directive from helper files like `youtube-search.ts` that export non-function object configurations (like LangChain tools).

## R3F Sub-Component Unmounted Prop Ref TypeError

* Symptom: Runtime TypeError `Cannot read properties of undefined (reading 'current')` inside `BloomCompanion`'s `useFrame` callback.
* Root Cause: When components are mounted or during early frame cycles before canvas props settle, `playerPositionRef` can be undefined if not defensively checked.
* Resolution: Made `playerPositionRef?: React.RefObject<THREE.Vector3>` optional in `BloomCompanionProps` and guarded access with optional chaining `playerPositionRef?.current`.

## Missing getTerrainHeight Import in GardenExperience

* Symptom: Runtime ReferenceError `getTerrainHeight is not defined` when initializing `bloomPosition`.
* Root Cause: `getTerrainHeight` was called to calculate Bloom's elevation on terrain without importing it from `../utils/terrainMath`.
* Resolution: Imported `getTerrainHeight` from `../utils/terrainMath` in `GardenExperience.tsx`.

## Undestructured onTriggerDiscovery Prop in GardenScene

* Symptom: Runtime ReferenceError `onTriggerDiscovery is not defined` at `EnvironmentProps` call in `GardenScene.tsx`.
* Root Cause: `onTriggerDiscovery` was added to `GardenSceneProps` interface but omitted from the component function parameter destructuring list.
* Resolution: Added `onTriggerDiscovery` to the destructuring parameter list of `GardenScene` in `src/features/garden/scene/GardenScene.tsx`.

## Missing getTerrainHeight in GardenScene for Horizon Silhouettes

* Symptom: Runtime ReferenceError `getTerrainHeight is not defined` in `GardenScene.tsx` when positioning enclosing perimeter trees.
* Root Cause: `getTerrainHeight` was called inside `GardenScene.tsx` without an explicit import statement.
* Resolution: Imported `getTerrainHeight` from `../utils/terrainMath` into `GardenScene.tsx`.

## Next.js SSR Hydration Mismatch in QualityToggle

* Symptom: Console Error `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties (aria-pressed)`.
* Root Cause: `useQualityLevel` initialized quality state synchronously by reading `localStorage` during initial client render, differing from the server-rendered HTML default.
* Resolution: Initialized quality state with `DEFAULT_QUALITY` and loaded stored preference asynchronously inside `useEffect`.




