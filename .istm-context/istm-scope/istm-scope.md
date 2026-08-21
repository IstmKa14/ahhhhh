# Scope: MindBloom v2

MindBloom is a calm wellness space for students, built around a persistent AI companion called Bloom and an interactive 3D Garden. Users can talk to Bloom, journal, explore the Garden, and perform small calming interactions across a connected React and Three.js experience.

**Build approach:** Tracer Bullet (prove every layer connects end to end before thickening any segment).
**Workflow:** Medium (after /istm-develop, run /istm-check verify then /istm-test; architect still gates every feature that needs a decision).

---

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| A | Landing page | Existing | existing |
| B | Auth (Firebase) | Existing | existing |
| C | Journal (Firestore) | Existing | existing |
| D | Chat page (LangChain + Groq) | Existing | existing |
| E | Resources page | Existing | existing |
| F | Games page | Existing | existing |
| 1 | R3F + Garden foundation | Phase 1 | in-progress |
| 2 | Bloom character system | Phase 2 | planned |
| 3 | Bloom AI + state machine | Phase 3 | planned |
| 4 | Voice conversation | Phase 4 | planned |
| 5 | Garden interactions (flowers, pond, bench) | Phase 5 | planned |
| 6 | Planting and growth lifecycle | Phase 6 | planned |
| 7 | Garden persistence (Firestore) | Phase 7 | planned |
| 8 | Journal + Garden connection | Phase 8 | planned |
| 9 | Performance + quality levels + mobile optimization | Phase 9 | planned |
| 10 | Accessibility and WebGL fallback | Phase 10 | planned |

---

## Existing features

### A. Landing page · existing

Seven section animated landing page using GSAP and Lenis. code in `src/app/(landing)/` and `src/features/landing/`

### B. Auth (Firebase) · existing

Firebase auth with local mock fallback when env keys are missing. Sign in, sign up, sessions. code in `src/services/auth-service.ts` and `src/app/(auth-routes)/`

### C. Journal (Firestore) · existing

Tree journal backed by Firestore. Users write notes. code in `src/services/journal-service.ts`, `src/components/journal/`, `src/app/journal/`

### D. Chat page (LangChain + Groq) · existing

Text chat with the AI tree spirit via LangChain and Groq. AI flows in `src/ai/flows/tree-ai-chat.ts`. code in `src/app/chat/`

### E. Resources page · existing

AI generated personalized resource recommendations, YouTube search integration. code in `src/app/resources/`, `src/ai/flows/`

### F. Games page · existing

Mini calming games. code in `src/app/games/`, `src/components/games/`

---

## Phase 1: R3F + Garden foundation

### 1. R3F + Garden foundation · in-progress

Install React Three Fiber, drei, and Three.js. Build a performant, extensible Garden scene with basic terrain, lighting, camera, WASD desktop movement, virtual joystick mobile movement, and the interaction detection foundation that all later Garden features build on. This is the walking skeleton of the 3D world.

**Done when:** the Garden page loads at `/garden`, a basic scene with terrain, ambient lighting, and a sky renders; the player can move with WASD on desktop and a virtual joystick on mobile; frame rate holds at 60fps on a mid range device; the canvas and React UI layers are cleanly separated as `GardenCanvas` and `GardenUI`; the performance foundation (InstancedMesh pattern, LOD stubs, quality level config, frustum culling hooks) is in place for later features to use.

- [x] Design it (spec): `/istm-craft R3F + Garden foundation`
- [ ] Build it: `/istm-develop R3F + Garden foundation`
   - [ ] Install R3F, drei, three, nipplejs; add transpilePackages to next.config.ts if needed
   - [ ] Types, constants, quality profiles, and useQualityLevel hook
   - [ ] Garden layout + page route; Player movement hooks + Player component
   - [ ] Garden scene (terrain, sky, lights, placeholder objects with InstancedMesh)
   - [ ] Interaction system, GardenCanvas, GardenUI, MobileControls, error boundary; Header nav link
- [ ] Verify it: `/istm-check verify R3F + Garden foundation`
- [ ] Test it: `/istm-test R3F + Garden foundation`
Spec 0001 · code in `src/features/garden/` and `src/app/garden/`

---

## Phase 2: Bloom character system

### 2. Bloom character system · needs a decision

Bloom exists as two connected representations. The 2D Bloom is a set of SVG pose assets used across the normal React UI (chat, journal, dashboard, onboarding, empty states). The 3D Bloom is a character inside the Garden using R3F, sharing the same visual identity (silhouette, colors, personality) as 2D Bloom. Both connect to the Bloom state machine (Phase 3), but the visual layer is designed and built here first.

**Done when:** SVG assets exist for all nine 2D Bloom poses (idle, happy, listening, thinking, speaking, curious, calm, celebrating, concerned, resting); a `Bloom2D` component renders the correct pose based on a state prop; a `Bloom3D` component renders in the Garden with idle and walking animations; Bloom appears in the Garden at a defined starting position; switching poses in response to a state string works end to end.

- [ ] Design it (spec): `/architect Bloom character system`

---

## Phase 3: Bloom AI + state machine

### 3. Bloom AI + state machine · needs a decision

Connect the AI layer to Bloom's visual state. Bloom moves through a small deterministic state machine (idle, listening, thinking, speaking, happy, curious, resting). The state updates drive both the 2D and 3D Bloom visual. The existing LangChain + Groq chat flow is refactored or extended to serve Bloom as a character, not a generic chatbot. Chat UI remains a normal accessible React interface above the canvas, never inside Three.js. Streaming responses, stop generation, and regenerate are supported where the Groq provider allows.

**Done when:** sending a message sets Bloom to listening; while Groq generates a response Bloom shows thinking; when the response arrives Bloom shows speaking; after the response Bloom returns to idle; the state machine is extensible (new states can be added without rewriting it); the chat UI is accessible and keyboard navigable; no chat text is rendered inside the canvas.

- [ ] Design it (spec): `/architect Bloom AI + state machine`

---

## Phase 4: Voice conversation

### 4. Voice conversation · needs a decision

Bloom can receive spoken input and optionally respond aloud. Speech to text converts microphone input to text and sends it through the existing Bloom AI flow. Text to speech speaks Bloom's response and triggers the speaking animation. Both are modular: provider interfaces mean STT and TTS can be swapped without touching the AI or UI layers. Required environment variables are documented. Voice is off by default and opt in per session.

**Done when:** the user can tap a microphone button, speak, and have their words sent to Bloom as text; Bloom's text response can optionally be spoken aloud; the speaking animation plays during audio playback; swapping the STT or TTS provider requires changing only one module; missing env vars degrade gracefully to text only mode with a clear message.

- [ ] Design it (spec): `/architect voice conversation`

---

## Phase 5: Garden interactions (flowers, pond, bench)

### 5. Garden interactions · needs a decision

Build the reusable interaction system and the first three concrete interactions. The interaction system lets any Garden object expose a contextual prompt when the player is near. The three interactions are: picking a flower (the flower sways, detaches, and disappears with animation), the pond (tap or click to create a shader ripple, no fluid simulation), and the bench (player sits, camera transitions, Bloom can optionally approach, three simple options appear: talk, breathe, just sit). Garden contextual AI is wired here: Bloom can comment on nearby interactions through the AI layer.

**Done when:** the `InteractiveObject` abstraction works for any object type; approaching any interactable object shows a subtle contextual prompt; picking a flower plays a sway and detach animation; tapping the pond creates a ripple effect without expensive simulation; sitting on the bench transitions the camera and shows the quiet interaction panel; Bloom can generate a contextual comment for each interaction type.

- [ ] Design it (spec): `/architect Garden interactions`

---

## Phase 6: Planting and growth lifecycle

### 6. Planting and growth lifecycle · needs a decision

The user can pick up a watering can, walk to a plant, and water it with a lightweight particle or geometry effect. The user can plant seeds that progress through a growth lifecycle (seed, sprout, small plant, growing plant, flower). Growth state is data driven. Watering a plant reacts visually (leaves move, small droplets, soil change). The persistence of growth state waits for Phase 7, but the data model and state structure is designed here so Phase 7 can wire storage cleanly.

**Done when:** the watering can interaction plays a satisfying lightweight water effect on a plant; the plant reacts with movement and visual feedback; the seed to flower lifecycle has four distinct visual stages; the growth state is a typed data structure that a persistence layer can store; no continuous background simulation runs for off screen plants.

- [ ] Design it (spec): `/architect planting and growth lifecycle`

---

## Phase 7: Garden persistence (Firestore)

### 7. Garden persistence · needs a decision

Garden state becomes durable. Planted seeds, grown flowers, picked flowers, Bloom interaction history, and favorite locations are stored in Firestore under the existing auth user. The Garden data layer is a clean module so the storage provider can be replaced later. The schema uses the existing Firestore setup and auth without adding a new backend.

**Done when:** plants persist across sessions; picked flowers are gone on reload; Bloom remembers recent interactions across sessions (appropriate context window); Garden state loads on Garden entry and saves on changes; the Firestore schema is documented in the spec.

- [ ] Design it (spec): `/architect Garden persistence`

---

## Phase 8: Journal + Garden connection

### 8. Journal + Garden connection · needs a decision

Journal entries create visual elements in the Garden. A meaningful entry creates a flower. A gratitude entry creates a small plant. A milestone entry creates a tree. The Garden becomes a visual memory of the user's journey. Extension points exist so new entry types can create new Garden elements without rewriting the connection layer.

**Done when:** creating a journal entry of each type (reflection, gratitude, milestone) produces the correct Garden element; the element appears on next Garden visit; Bloom can comment on a newly appeared memory element; the mapping is configuration driven (entry type to Garden element) so new types can be added in one place.

- [ ] Design it (spec): `/architect Journal + Garden connection`

---

## Phase 9: Performance + quality levels + mobile optimization

### 9. Performance + quality levels · needs a decision · Full

Full quality system: Low, Medium, and High profiles with different draw call budgets, shadow quality, particle counts, and pixel ratio. Distance based animation culling (near full, medium simplified, far static). Mobile specific rendering profile with fewer objects, reduced draw calls, touch controls, and lower pixel ratio. Automated quality detection on load. Performance is a first class feature here, not an afterthought, so this feature runs Full tier.

**Done when:** the quality system has three named profiles switchable at runtime; the Garden renders at an acceptable frame rate on a mid range mobile device in Low mode; distance based culling is active (objects beyond a threshold stop animating); mobile automatically selects Low or Medium; all InstancedMesh, LOD, and frustum culling patterns from Phase 1 are fully utilized.

- [ ] Design it (spec): `/architect performance + quality levels`

---

## Phase 10: Accessibility and WebGL fallback

### 10. Accessibility and WebGL fallback · needs a decision

When WebGL is unavailable or the device cannot reasonably support the 3D environment, a lightweight fallback renders. The user can still talk to Bloom (2D), journal, access resources, and perform calming activities. The Garden is represented as a simplified illustration or card layout, not an error screen. Core wellness functionality is never gated behind WebGL.

**Done when:** the app detects WebGL unavailability and renders the fallback without an error; the fallback includes 2D Bloom chat, journal, and resource access; the Garden fallback communicates the situation warmly without feeling broken; keyboard and screen reader accessibility passes on all non-Garden surfaces; WCAG 2.1 AA is the target for all React UI.

- [ ] Design it (spec): `/architect accessibility and WebGL fallback`

---

## Deferred

Out of scope for the current build pass, kept so the plan stays honest.

- **Garden areas (Bloom Corner, Journal Grove, Play Garden, Resource Path)**: multiple named zones, unlockable areas, needs a decision
- **Calming 3D activities (Breathing Flower, Fireflies, Wind)**: short standalone 3D experiences inside the Garden, needs a decision
- **Product analytics and error monitoring**: track activation, garden visits, Bloom conversations, needs a decision
- **Onboarding flow**: first time user experience introducing Bloom and the Garden, needs a decision
- **Dashboard Bloom integration**: Bloom 2D with contextual messages on the main dashboard, needs a decision
- **Internationalization**: multiple locales, needs a decision
- **Legal and compliance**: cookie consent, privacy policy, GDPR handling, needs a decision

---

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle:**

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/istm-scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | `/architect` at spec capture | `Design it` ticked; spec linked; `Build it: /istm-develop <feature>` + 2 to 5 milestones |
| `in-progress` (building) | `/istm-develop` | milestone sub-boxes tick one by one; code pointer filled |
| `done` | `/istm-check verify` (Lean) or `/istm-test` (Medium/Full) | required boxes ticked |

- **Next step** = the first unticked box (always a command or tracked milestone).
- **needs a decision** = run `/architect` first; the tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped).
- **Workflow tier tag** beside a heading (e.g. `· Full`) overrides the project default for that one feature; no tag = inherit.
- **Medium workflow** = after `/istm-develop`, run `/istm-check verify` then `/istm-test`. Architect still gates any feature with a decision at every tier.
