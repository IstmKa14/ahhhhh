# Architecture

## Architecture Goals

The architecture should be:
- Maintainable and testable with clear domain boundaries
- Real-time first: every mutation must propagate to all connected clients within 100ms on a good network
- Optimistic UI by default: canvas operations must feel instant regardless of network round trips
- Edge ready: auth and presence checks run at the Vercel edge, not in Node.js origins
- Horizontally scalable because Liveblocks handles all stateful collaboration infrastructure externally

Avoid unnecessary complexity. Follow the Next.js App Router conventions from the Next.js 16 docs found in `node_modules/next/dist/docs/`.

---

# System Overview

```
Browser (Client)
  │
  ├── Clerk (auth session, JWT)
  ├── tldraw (canvas rendering, tool engine)
  └── Liveblocks Room (real-time cursors, presence, CRDT storage)
         │
         ↓
  Next.js 16 App Router (Vercel Edge + Node.js)
  ├── /app                   — page routes and layouts
  ├── /app/api               — Route Handlers (REST endpoints)
  ├── /app/(auth)            — Clerk sign-in / sign-up routes
  ├── /app/(dashboard)       — Boards list, workspace management
  ├── /app/board/[boardId]   — tldraw canvas with Liveblocks room
  ├── /lib/db                — Drizzle ORM + Neon client
  ├── /lib/liveblocks        — Liveblocks server client and room auth
  ├── /lib/s3                — AWS S3 upload helpers
  └── /lib/imagekit          — ImageKit URL transformation helpers
         │
         ↓
  Neon PostgreSQL (serverless Postgres)
  Liveblocks (real-time room state, CRDT, presence)
  AWS S3 + ImageKit (file storage and image optimization)
```

---

# Tech Stack

## Frontend
- Framework: Next.js 16 (App Router, TypeScript)
- Canvas Engine: tldraw (drawing tools, shapes, selection, infinite canvas, undo/redo)
- Real-time Collaboration: Liveblocks (rooms, presence, CRDT storage, webhooks)
- Styling: Tailwind CSS v4 (semantic tokens via `@theme`)
- UI Primitives: shadcn/ui (Radix based)
- State Management: Zustand (client UI state, toolbar state, modal state)
- Data Fetching: Next.js Server Components + Server Actions (mutations)
- Validation: Zod (all inputs, server actions, route handlers)

## Backend and API
- Runtime: Next.js 16 Route Handlers (Edge where possible, Node.js where Drizzle requires)
- Database: Neon PostgreSQL (serverless, auto-scaling, connection pooling via `@neondatabase/serverless`)
- ORM: Drizzle ORM (schema in `db/schema.ts`)
- Auth: Clerk (JWT sessions, middleware, server-side `currentUser()`)
- File Storage: AWS S3 (raw uploads), ImageKit CDN (optimized delivery and transforms)

## Infrastructure
- Hosting: Vercel (Edge Network, automatic previews)
- Database: Neon (managed serverless Postgres)
- Real-time: Liveblocks Cloud
- Media: AWS S3 + ImageKit
- CI/CD: Vercel Git integration

---

# Folder Structure

```
cansvaly/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          — sidebar, org switcher, nav
│   │   ├── page.tsx            — boards grid / home
│   │   ├── boards/
│   │   │   └── page.tsx        — all boards list
│   │   ├── org/
│   │   │   └── [orgId]/page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── board/
│   │   └── [boardId]/
│   │       ├── page.tsx        — canvas page (loads Liveblocks room)
│   │       └── loading.tsx
│   ├── api/
│   │   ├── liveblocks-auth/route.ts   — POST: Liveblocks room JWT
│   │   ├── boards/
│   │   │   ├── route.ts               — GET list, POST create
│   │   │   └── [boardId]/route.ts     — GET, PATCH, DELETE
│   │   ├── upload/
│   │   │   └── route.ts               — POST: S3 presigned URL
│   │   └── export/
│   │       └── [boardId]/route.ts     — GET: PNG/SVG export
│   ├── layout.tsx
│   └── globals.css
├── components/              — UI components (root-level, no src/ wrapper)
│   ├── ui/                  — shadcn/ui primitives
│   ├── canvas/              — tldraw wrappers and canvas toolbar
│   │   ├── Canvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── Cursors.tsx
│   │   └── Presence.tsx
│   ├── board/               — board card, grid, header
│   │   ├── BoardCard.tsx
│   │   ├── BoardGrid.tsx
│   │   └── BoardHeader.tsx
│   ├── dashboard/           — sidebar, nav, workspace switcher
│   │   ├── Sidebar.tsx
│   │   ├── OrgSwitcher.tsx
│   │   └── NewBoardButton.tsx
│   └── shared/              — Avatar, EmptyState, Spinner
├── db/
│   ├── index.ts             — Drizzle client (neon http adapter)
│   └── schema.ts            — all table definitions
├── lib/
│   ├── liveblocks.ts
│   ├── s3.ts
│   ├── imagekit.ts
│   └── validations.ts
├── hooks/
├── stores/
└── types/
├── drizzle/
└── public/
```

---

# Database Schema (Drizzle ORM, Neon PostgreSQL)

## `users`
- id: text (primary key, Clerk user ID)
- email: text unique not null
- name: text
- avatarUrl: text
- createdAt: timestamp default now()
- updatedAt: timestamp

## `organizations`
- id: text (primary key, Clerk org ID)
- name: text not null
- slug: text unique
- logoUrl: text
- ownerId: text → users.id
- plan: text default 'free' (values: 'free' | 'pro' | 'enterprise')
- createdAt: timestamp default now()
- updatedAt: timestamp

## `boards`
- id: uuid primary key default gen_random_uuid()
- title: text not null
- description: text
- thumbnailUrl: text (ImageKit URL, updated on save)
- orgId: text → organizations.id
- createdById: text → users.id
- isFavorited: boolean default false
- isPublic: boolean default false
- liveblocksRoomId: text unique not null
- createdAt: timestamp default now()
- updatedAt: timestamp

## `board_members`
- id: uuid primary key
- boardId: uuid → boards.id (cascade delete)
- userId: text → users.id
- role: text not null (values: 'owner' | 'editor' | 'viewer' | 'commenter')
- joinedAt: timestamp default now()

## `board_activity`
- id: uuid primary key
- boardId: uuid → boards.id
- userId: text → users.id
- action: text not null (values: 'created' | 'edited' | 'commented' | 'shared' | 'exported')
- metadata: jsonb
- createdAt: timestamp default now()

## `comments`
- id: uuid primary key
- boardId: uuid → boards.id
- userId: text → users.id
- content: text not null
- positionX: real (canvas X coordinate for anchored comments)
- positionY: real (canvas Y coordinate for anchored comments)
- resolved: boolean default false
- parentId: uuid → comments.id (threaded replies)
- createdAt: timestamp default now()
- updatedAt: timestamp

## `board_shares`
- id: uuid primary key
- boardId: uuid → boards.id
- shareToken: text unique not null (random token for link sharing)
- role: text not null (values: 'viewer' | 'editor' | 'commenter')
- expiresAt: timestamp
- createdAt: timestamp default now()

---

# Authentication

Provider: Clerk

Methods:
- Email and password
- Google OAuth
- GitHub OAuth (optional)
- Organization invites via Clerk org membership

Rules:
- Auth middleware at `middleware.ts` using `clerkMiddleware()` protects all dashboard and board routes
- Liveblocks room access is authorized via `/api/liveblocks-auth`. It calls `auth()` from `@clerk/nextjs/server`, validates board membership in Postgres, then issues a Liveblocks JWT
- `currentUser()` is used in Server Components. `auth()` is used in Server Actions and Route Handlers
- Authentication state stays isolated. Never pass Clerk session objects into Zustand

---

# Real-Time Architecture (Liveblocks)

## Room Strategy
Each board maps 1:1 to a Liveblocks room. Room ID equals `boards.liveblocksRoomId` (format: `board-{uuid}`).

## Storage (CRDT)
tldraw's Liveblocks store adapter uses `LiveObject` and `LiveMap` to sync the full tldraw document state. Every shape, layer, and camera position is a Liveblocks storage entry.

## Presence
Each connected user broadcasts:
```typescript
type UserPresence = {
  cursor: { x: number; y: number } | null
  selectedShapeIds: string[]
  name: string
  avatarUrl: string
  color: string   // deterministic color from user ID
}
```

## Webhooks
Liveblocks webhooks fire on `storageUpdated` events. The handler at `/api/liveblocks-webhooks` generates a thumbnail snapshot and writes it to S3 via tldraw's export API, then updates `boards.thumbnailUrl`.

---

# Core Workflows

## Workflow 1: Create and Open a Board
1. User clicks "New Board" in the dashboard
2. Server Action `createBoard()` inserts a row into `boards`, creates a Liveblocks room, and adds the creator as `owner` in `board_members`
3. User is redirected to `/board/[boardId]`
4. Page loads the Canvas component which initializes the tldraw store backed by Liveblocks
5. Presence appears in the avatar bar. Other users joining see the cursor immediately

## Workflow 2: Invite a Collaborator
1. User opens the Share dialog on a board
2. Clerk invitation is sent to the email address
3. On acceptance, a Clerk org membership is created
4. `board_members` row is inserted with the chosen role
5. The invited user can now open the board and their access is validated at Liveblocks auth time

## Workflow 3: Export a Board
1. User opens the Export dialog and selects PNG or SVG
2. Browser calls `/api/export/[boardId]` Route Handler
3. Server initializes a headless tldraw store and loads the Liveblocks room snapshot
4. tldraw's `exportToBlob()` renders and returns the file
5. File is streamed back as a download response

---

# State Management Rules

Use Zustand for UI-only client state:
- `toolbarStore`: active tool, color, stroke width, fill
- `modalStore`: which modal is open (share, export, invite, delete confirm)
- `sidebarStore`: collapsed state, active section

Never put server-derived data (boards list, user profile) into Zustand. Fetch it in Server Components and pass as props, or use server cache.

---

# Performance Rules

Use:
- Dynamic import via `next/dynamic` for the Canvas component (heavy tldraw bundle)
- `loading.tsx` skeleton on the board route to prevent layout shift
- Liveblocks presence batching (50ms throttle on cursor broadcast)
- ImageKit URL transforms for board thumbnails (`w=400,f=webp,q=80`)
- `next/image` with `fill` and `priority` for LCP thumbnails in the dashboard grid

Avoid:
- Marking pages as 'use client' when only leaf components need interactivity
- Importing tldraw at the top level in any Server Component
- Unthrottled presence updates (minimum 16ms floor on cursor events)

---

# Security Rules

- All Server Actions must call `auth()` and verify the user has access before any mutation
- All Route Handlers validate input with Zod before touching the database
- Liveblocks auth checks board membership in Postgres before issuing a room JWT
- S3 uploads use short-lived presigned URLs (15 minute expiry)
- CSP headers configured in `next.config.ts`
- Never expose Liveblocks secret key or S3 secret key to the client bundle

---

# Future Expansion and Scalability

- AI assistant to summarize and auto-arrange canvas content (Vercel AI SDK)
- Version history timeline with snapshot rewind (Liveblocks version history API)
- Templates marketplace: boards published as reusable starting points
- Multiplayer voice and video rooms (LiveKit integration)
- Mobile app using React Native with tldraw mobile adapter
- Enterprise SSO via Clerk SAML
