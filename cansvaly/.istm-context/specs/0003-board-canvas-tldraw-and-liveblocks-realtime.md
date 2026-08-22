# Spec 0003: Board Canvas, tldraw Integration, Liveblocks Realtime Sync & Comments

**Status**: In Progress

## Summary & Requirements

This specification defines the architecture, component hierarchy, types, API contracts, and step-by-step build plan for the Canvasly Board Canvas. It combines tldraw's infinite drawing engine with Liveblocks realtime presence, CRDT storage synchronization (`@tldraw/sync`), and Liveblocks Anchored Threads/Comments.

### Core Acceptance Criteria
1. **Dynamic Client Loading**: `app/board/[boardId]/page.tsx` must load `Canvas.tsx` dynamically via `next/dynamic({ ssr: false })` with a loading skeleton in `loading.tsx`.
2. **Liveblocks Authentication**: Route Handler `/api/liveblocks-auth/route.ts` runs on Node.js runtime, validates Clerk auth session, verifies board membership in Neon DB via Drizzle, and returns a Liveblocks Room JWT.
3. **Room & Sync Setup**: Board maps 1:1 to Liveblocks room `board-{boardId}`. tldraw store syncs using `@tldraw/sync` store adapter.
4. **Presence & Cursors**: Real-time cursor coordinates throttled at 16ms broadcasted via Liveblocks presence (`hooks/usePresence.ts`). `Cursors.tsx` renders smooth 75ms cursor transforms with collaborator badges.
5. **Presence Avatars**: `Presence.tsx` renders active member avatars (up to 4 + N counter) with deterministic presence ring colors (`lib/presence-colors.ts`).
6. **Custom Canvas Toolbar**: Override tldraw default toolbar with custom `Toolbar.tsx` utilizing shadcn/ui `Button` primitives, tooltips, and Zustand `toolbarStore.ts`.
7. **Liveblocks Comments & Threads**: Floating comments trigger tool on toolbar, canvas click creates anchored thread pin on canvas coordinates, and slide-over Comments Panel renders threads using Liveblocks Thread primitives.
8. **Board Header & Navigation**: Top bar (`BoardHeader.tsx`) renders editable inline board title (with auto-save Server Action `renameBoardAction`), share modal trigger, presence stack, comments toggle, and home navigation.

---

## UI & Architecture Standards

### Primitive Reuse Priority (shadcn/ui)
All UI elements outside the raw tldraw canvas context MUST use shadcn/ui primitives:
- `Button` (`components/ui/button.tsx`) for toolbar buttons, topbar actions, zoom controls
- `Tooltip` (`components/ui/tooltip.tsx`) for all canvas toolbar tools and shortcut indicators
- `Avatar`, `AvatarImage`, `AvatarFallback` (`components/ui/avatar.tsx`) for collaborator presence
- `Sheet` (`components/ui/sheet.tsx`) for mobile comments panel and mobile toolbar options
- `Input` (`components/ui/input.tsx`) for inline board title editing
- `DropdownMenu` (`components/ui/dropdown-menu.tsx`) for board header action overflow

### Tailwind v4 Semantic Standard
Strictly enforce semantic CSS utility classes:
- Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
- Text: `text-foreground`, `text-card-foreground`, `text-muted-foreground`
- Borders & Rings: `border-border`, `ring-ring`
- Hover/Accent: `hover:bg-accent`, `hover:text-accent-foreground`

---

## Strict Type Definitions & Contracts

### 1. Liveblocks Schema (`types/liveblocks.ts`)
```typescript
export type Presence = {
  cursor: { x: number; y: number } | null;
  selectedShapeIds: string[];
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    color: string;
  };
};

export type Storage = {
  // Store handled by @tldraw/sync CRDT storage structure
};

export type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
    color: string;
  };
};

export type RoomEvent = {
  type: 'NOTIFICATION';
  message: string;
};

export type ThreadMetadata = {
  boardId: string;
  x: number;
  y: number;
  resolved: boolean;
};
```

### 2. Toolbar Zustand Store (`stores/toolbarStore.ts`)
```typescript
import { create } from 'zustand';

export type CanvasTool = 'select' | 'hand' | 'draw' | 'eraser' | 'rectangle' | 'ellipse' | 'arrow' | 'text' | 'note' | 'comment';

interface ToolbarState {
  activeTool: CanvasTool;
  strokeColor: string;
  fillColor: string;
  strokeWidth: 'small' | 'medium' | 'large';
  isCommentsPanelOpen: boolean;
  setActiveTool: (tool: CanvasTool) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: 'small' | 'medium' | 'large') => void;
  toggleCommentsPanel: () => void;
  setCommentsPanelOpen: (open: boolean) => void;
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeTool: 'select',
  strokeColor: '#0f0f11',
  fillColor: 'transparent',
  strokeWidth: 'medium',
  isCommentsPanelOpen: false,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  toggleCommentsPanel: () => set((state) => ({ isCommentsPanelOpen: !state.isCommentsPanelOpen })),
  setCommentsPanelOpen: (open) => set({ isCommentsPanelOpen: open }),
}));
```

---

## File Hierarchy & Component Structure

```
cansvaly/
├── app/
│   ├── api/
│   │   └── liveblocks-auth/
│   │       └── route.ts            — POST: issues Liveblocks room JWT with Clerk & Postgres verification
│   └── board/
│       └── [boardId]/
│           ├── page.tsx            — Async Server Component, fetches board info, renders Canvas dynamically
│           └── loading.tsx         — Full-screen loading skeleton matching canvas chrome
├── components/
│   ├── canvas/
│   │   ├── Canvas.tsx              — Dynamic 'use client' component wrapping tldraw & Liveblocks RoomProvider
│   │   ├── Toolbar.tsx             — Custom CanvaslyToolbar (overrides tldraw toolbar via components prop)
│   │   ├── Cursors.tsx             — Realtime collaborator cursor overlay with 16ms throttle & smooth transform
│   │   ├── Presence.tsx            — Live collaborator avatar stack with presence color rings
│   │   ├── BoardHeader.tsx         — Top navigation bar, inline editable board title, share CTA, comments toggle
│   │   ├── CanvasComments.tsx      — Anchored comment pins layer & slide-over thread panel
│   │   └── ZoomControls.tsx        — Canvas zoom in, zoom out, fit to view floating controls
├── hooks/
│   └── usePresence.ts              — Custom React hook managing Liveblocks presence & cursor throttling
├── lib/
│   └── liveblocks.ts               — Liveblocks client configuration, room setup, and createClient instance
└── types/
    └── liveblocks.ts               — TypeScript type definitions for Liveblocks presence & thread metadata
```

---

## Step-by-Step Implementation Build Plan

### Step 1: Global Setup & Packages
- Install necessary canvas and collaboration dependencies: `tldraw`, `@tldraw/sync`, `@liveblocks/client`, `@liveblocks/react`, `@liveblocks/react-ui`, `@liveblocks/node`.
- Ensure `@theme` and semantic tokens in `app/globals.css` properly support dark mode canvas overlay and floating panel elevations (`shadow-md`, `shadow-xl`, `z-50`).

### Step 2: Liveblocks Server Authentication Route
- Implement `app/api/liveblocks-auth/route.ts`:
  - Enforce Node.js runtime (`export const runtime = 'nodejs'`).
  - Extract user ID via Clerk `auth()`. Return `401` if unauthenticated.
  - Query `board_members` table in Neon DB via Drizzle to verify user access to `boardId`.
  - Issue JWT access token using `liveblocks.prepareSession()` with user ID, name, avatar, and color from `getPresenceColor(userId)`.
  - Return `{ token }` JSON response with `200` status.

### Step 3: Room Provider & Liveblocks Hooks Infrastructure
- Create `lib/liveblocks.ts` configuring `createClient` pointing to `/api/liveblocks-auth`.
- Create `types/liveblocks.ts` defining `Presence`, `UserMeta`, and `ThreadMetadata`.
- Create `hooks/usePresence.ts` encapsulating `useMyPresence`, `useOthers`, and cursor broadcast throttling (using `lodash.throttle` or custom 16ms RAF throttling).

### Step 4: Core Canvas & Dynamic Wrapper
- Create `app/board/[boardId]/loading.tsx` rendering a full-screen canvas loading skeleton (topbar skeleton, left toolbar skeleton, dark/light canvas background).
- Create `app/board/[boardId]/page.tsx` as a Server Component querying initial board title and permission metadata via `db.select()`, passing `boardId` and `board` data to `Canvas.tsx`.
- Create `components/canvas/Canvas.tsx` as `'use client'`, using `next/dynamic({ ssr: false })` to load tldraw and wrapping with Liveblocks `RoomProvider` and `ClientSideSuspense`.

### Step 5: Custom Canvas Toolbar & State Management
- Create `stores/toolbarStore.ts` with Zustand to manage tool selection (`select`, `hand`, `draw`, `rectangle`, `ellipse`, `arrow`, `text`, `note`, `comment`), color palettes, stroke widths, and comments panel state.
- Create `components/canvas/Toolbar.tsx` rendering floating left toolbar with shadcn `Button` and `Tooltip` primitives, bound to `useToolbarStore`.

### Step 6: Realtime Collaborator Cursors & Avatar Stack
- Create `components/canvas/Cursors.tsx` reading `useOthers()` presence, rendering absolute positioned cursor pointers with 75ms CSS transition and member name badges.
- Create `components/canvas/Presence.tsx` rendering topbar avatar stack using `components/ui/avatar.tsx` with `ring-2` colored by `presence-colors.ts`.

### Step 7: Topbar Header & Inline Board Title Editing
- Create `components/canvas/BoardHeader.tsx`:
  - Renders back button link to `/dashboard`.
  - Editable inline input for board title (triggers `renameBoardAction` on blur/enter).
  - Share button triggering `share` modal in `modalStore`.
  - `Presence.tsx` avatar stack.
  - Comments toggle button displaying unread count badge.

### Step 8: Anchored Comments & Liveblocks Thread Panel
- Implement `components/canvas/CanvasComments.tsx`:
  - Listens for canvas click when `activeTool === 'comment'`.
  - Creates anchored thread at clicked canvas coordinates `(x, y)` using Liveblocks `useCreateThread`.
  - Displays interactive pin icons at canvas coordinates.
  - Slide-over panel (using shadcn `Sheet` or floating panel) rendering Liveblocks `Thread` components for active or selected comment threads.

---

## Verification & Definition of Done

- [ ] `tsc --noEmit` completes with 0 errors and zero `any` types.
- [ ] Navigating to `/board/[boardId]` loads the tldraw canvas cleanly without SSR hydration errors.
- [ ] Opening board in two separate browser windows/sessions displays smooth realtime cursor movement and live shape syncing via Liveblocks.
- [ ] Clicking the comment tool and dropping a pin on the canvas opens a Liveblocks thread composer.
- [ ] Renaming the board title in `BoardHeader.tsx` persists to Neon PostgreSQL.
- [ ] `progress.md` is updated with completed canvas deliverables.
