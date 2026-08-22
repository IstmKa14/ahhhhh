# Canvasly — AI Agent Working Instructions

This document defines how AI coding agents should understand, architect, and implement Canvasly.

Everything written here is considered project context.

Never ignore these rules.

---

# Project Overview

Canvasly is a production-grade real-time collaborative whiteboard. Users create boards, draw and design together, invite collaborators, and work simultaneously on the same infinite canvas. Collaboration is a first-class feature, not an afterthought.

The goal is to build a genuinely excellent product: fast, fluid, polished, and ready for real teams to use.

---

# Core Product Principles

The product should always feel:
- Fast (canvas interactions are instant; real-time sync is imperceptible)
- Collaborative (presence cursors, avatars, and activity are always visible)
- Professional (design tool aesthetic, not a toy or demo)
- Clean (minimal chrome, maximum canvas space)
- Reliable (auth, persistence, and real-time all work together without gaps)

Never make the application feel like a generic demo. Everything should feel like a tool real teams use daily.

---

# Tech Stack (Locked)

All decisions below are final. Do not suggest alternatives.

- Runtime: Next.js 16 with App Router and TypeScript
- Canvas Engine: tldraw
- Real-time Collaboration: Liveblocks (rooms, CRDT storage, presence, webhooks)
- Auth: Clerk (email+password, Google OAuth, organization management)
- Database: Neon PostgreSQL (serverless)
- ORM: Drizzle ORM (schema at `db/schema.ts`)
- Styling: Tailwind CSS v4 (semantic tokens via `@theme` in `globals.css`)
- UI Primitives: shadcn/ui (Radix based, files in `components/ui/`)
- State Management: Zustand (UI state only: toolbar, modals, sidebar)
- File Storage: AWS S3 (raw uploads) + ImageKit (CDN transforms)
- Validation: Zod (all Server Actions and Route Handler inputs)
- Hosting: Vercel

---

# Primary User Flow

User opens Canvasly
       ↓
Signs in with Clerk (email or Google OAuth)
       ↓
Lands on the Dashboard: sees their boards organized by workspace
       ↓
Creates or opens a board
       ↓
Draws, adds shapes, and collaborates in real-time with teammates via tldraw and Liveblocks
       ↓
Shares, exports, or comments on the board

---

# Core Engineering and Code Standards

1. Compiler-Grade TypeScript:
   - Strictly forbid `any` and `unknown as any`
   - Mandate explicit interfaces, discriminated unions for state, and Zod inference on all inputs
   - Infer database types from Drizzle schema using `typeof schema.$inferSelect` and `typeof schema.$inferInsert`

2. Modern Tailwind v4 Semantic Tokens:
   - Strictly forbid ugly inline arbitrary variables like `bg-[var(--background)]` or `text-[var(--foreground)]`
   - Use clean semantic utility classes only: `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`
   - All color values live in `app/globals.css`. Never hardcode hex values in component files (the only exception is `lib/presence-colors.ts`)

3. Primitive Reuse Priority (shadcn/ui):
   - For all interactive atoms (buttons, inputs, dialogs, dropdowns, tooltips, sheets, accordions, avatars), ALWAYS import from `components/ui/`
   - Never write a custom `<div>` click handler where a shadcn/ui Button, DropdownMenu, or Dialog would work

4. Stack-Idiomatic Structure (Next.js 16 App Router):
   - Route files live in `app/`. Page, layout, loading, and error files follow Next.js conventions
   - Read `node_modules/next/dist/docs/` for Next.js 16 specific API details before writing any Next.js specific code
   - Component folders live in `components/` (organized by domain: `canvas/`, `board/`, `dashboard/`, `shared/`, `ui/`)
   - DB schema and client live in `db/`
   - Library utilities live in `lib/`
   - Zustand stores live in `stores/`
   - Custom hooks live in `hooks/`
   - TypeScript types live in `types/`
   - Drizzle migrations live in `drizzle/`

5. Noise Comment Ban:
   - Strictly forbid redundant comments like `// handle click`, `// button component`, `// state for user`
   - Comments are permitted ONLY for non-obvious business invariants, complex algorithms, and Liveblocks-specific timing behaviors

---

# Next.js 16 Specific Rules

Always read `node_modules/next/dist/docs/` before writing Next.js code. Key rules based on the framework CSV:

- Use Server Components by default. Add `'use client'` only when a component uses hooks, event handlers, or browser APIs
- Push client components down to leaf nodes. Never mark a page file as `'use client'` if only a child needs it
- Fetch data in async Server Components via Drizzle queries. Never use `useEffect` for initial data loading
- In Next.js 15+ (and 16), `fetch` is uncached by default. Set `cache: 'force-cache'` explicitly for static data, or use `unstable_cache` with tags for server-side caching
- Use Server Actions for all mutations. Validate inputs with Zod. Call `auth()` from Clerk at the top of every action. Call `revalidatePath` or `revalidateTag` after each mutation
- Use `next/image` for all images. Never use `<img>` tags. Always provide width, height, or fill
- Use `next/link` for all internal navigation. Never use `<a>` for in-app routes
- Use `next/dynamic` with `{ ssr: false }` for the tldraw canvas component (it cannot render in SSR context)
- Use `middleware.ts` at the project root with `clerkMiddleware()` to protect all dashboard and board routes

---

# tldraw Integration Rules

- Import tldraw only inside a `'use client'` component that is loaded via `next/dynamic({ ssr: false })`
- Use tldraw's Liveblocks store adapter (`@tldraw/sync`) to sync canvas state via Liveblocks
- Override tldraw's `Toolbar` component via the `components` prop to render the custom `CanvaslyToolbar`
- Do not override tldraw's keyboard shortcuts or context menu behavior without a specific product requirement
- Export board snapshots using tldraw's `exportToBlob()` function in Route Handlers (not in client components)
- Presence data (cursor position, selected shapes) is broadcast via Liveblocks presence, not via tldraw's built-in collaboration store

---

# Liveblocks Integration Rules

- Each board maps to one Liveblocks room. Room ID format: `board-{boardId}`
- Liveblocks room JWT is issued by `/api/liveblocks-auth/route.ts`. This route must run in Node.js runtime (not Edge) because it queries Postgres via Drizzle
- The auth route must call `auth()` from Clerk, look up the board member record in Postgres, and only issue a JWT if the user has access
- Use Liveblocks presence to broadcast cursor positions, selected shape IDs, user name, avatar URL, and collaboration color
- Throttle cursor broadcast events to a minimum interval of 16ms on the client side
- On `storageUpdated` Liveblocks webhooks, generate a thumbnail via tldraw export and upload to S3 via ImageKit

---

# Clerk Integration Rules

- Use `clerkMiddleware()` in `middleware.ts` to protect all routes under `/(dashboard)` and `/board/`
- Use `currentUser()` in Server Components to get the full user object
- Use `auth()` in Server Actions and Route Handlers to get the user ID
- Use Clerk's organization features to power the workspace and team management UI
- Sync Clerk user data to the Postgres `users` table via a Clerk webhook at `/api/clerk-webhook/route.ts`
- Never store auth state in Zustand. Auth state comes from Clerk hooks on the client and `auth()` on the server

---

# Drizzle ORM Rules

- Define all tables in `db/schema.ts`
- Create the Neon client in `db/index.ts` using the `@neondatabase/serverless` adapter
- All database calls happen in Server Components, Server Actions, or Route Handlers — never in Client Components
- Use `db.select().from(table).where(eq(table.field, value))` style queries
- Use Drizzle's inferred types for all data shapes. Never manually write a TypeScript interface that duplicates a Drizzle table shape
- Run migrations with `drizzle-kit push` in development and `drizzle-kit migrate` in production

---

# Zustand Rules

Use Zustand only for UI-only client state:
- `toolbarStore`: active tool, stroke color, fill color, stroke width
- `modalStore`: which modal is open and any data it needs
- `sidebarStore`: collapsed state, active nav section

Never put server data (boards, users, org data) into Zustand. Fetch it in Server Components.

---

# Folder Structure

```
cansvaly/
├── app/                     — Routes only (Next.js App Router)
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── boards/page.tsx
│   │   ├── org/[orgId]/page.tsx
│   │   └── settings/page.tsx
│   ├── board/
│   │   └── [boardId]/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── api/
│   │   ├── liveblocks-auth/route.ts
│   │   ├── liveblocks-webhook/route.ts
│   │   ├── clerk-webhook/route.ts
│   │   ├── boards/
│   │   │   ├── route.ts
│   │   │   └── [boardId]/route.ts
│   │   ├── upload/route.ts
│   │   └── export/[boardId]/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/              — UI components (root-level, no src/ wrapper)
│   ├── ui/                  — shadcn/ui primitives (never edit manually)
│   ├── canvas/              — Canvas.tsx, Toolbar.tsx, Cursors.tsx, Presence.tsx
│   ├── board/               — BoardCard.tsx, BoardGrid.tsx, BoardHeader.tsx
│   ├── dashboard/           — Sidebar.tsx, OrgSwitcher.tsx, NewBoardButton.tsx
│   └── shared/              — Logo.tsx, Avatar.tsx, EmptyState.tsx, Spinner.tsx
├── db/                      — Drizzle schema and client
│   ├── index.ts
│   └── schema.ts
├── lib/                     — Utilities and third-party clients
│   ├── liveblocks.ts
│   ├── s3.ts
│   ├── imagekit.ts
│   ├── validations.ts
│   ├── presence-colors.ts
│   └── constants.ts
├── hooks/                   — Custom React hooks
│   ├── useBoard.ts
│   ├── usePresence.ts
│   └── useUpload.ts
├── stores/                  — Zustand UI stores
│   ├── toolbarStore.ts
│   ├── modalStore.ts
│   └── sidebarStore.ts
├── types/                   — TypeScript type definitions
│   ├── board.ts
│   ├── user.ts
│   └── liveblocks.ts
├── drizzle/                 — Drizzle migration files
├── middleware.ts
└── public/
```

Pages are routing layers only. No business logic, no API calls, no state management in pages.

---

# Pages Stay Thin

Pages should remain extremely small. Pages only render feature components. No business logic inside pages. No direct database calls inside page files (use Server Actions or co-located data fetching functions). No state management inside pages.

---

# Component Rules

Keep components focused. One responsibility. If a component grows past approximately 250 lines, split it. Prefer composition over complexity.

---

# File Length

No source file should exceed approximately 250 lines whenever reasonably possible. If a file becomes too large, split it and extract logic into hooks, utilities, or sub-components.

---

# State Management

Keep state local whenever possible. Lift state only when required. Global Zustand state should only exist when multiple features genuinely need it. Canvas state lives in Liveblocks, not Zustand.

---

# Constants and Configuration

Never hardcode values. Create constants for:
- Route paths: `lib/constants.ts`
- Canvas toolbar dimensions: `TOOLBAR_WIDTH = 56`, `TOPBAR_HEIGHT = 56`
- Presence throttle interval: `CURSOR_THROTTLE_MS = 16`
- Board thumbnail ImageKit transform: `THUMBNAIL_TRANSFORM = 'w-400,f-webp,q-80'`
- Collaboration color palette: `lib/presence-colors.ts`

---

# Progress and Error Memory Tracking

Two critical memory tracking files exist in the project:

1. `progress.md`: Tracks completed tasks, feature statuses, and pending deliverables.
2. `error-memory.md`: Tracks system architecture bugs, root causes, and verified fix patterns.

Before making code changes or diagnosing an error, inspect `error-memory.md` to avoid repeating past bugs. After fixing any meaningful bug, update both files with the symptom, root cause, and verified resolution.

---

# Planning Before Coding

Never immediately start implementing. Before writing code:

1. Understand the feature and its dependencies
2. Read the relevant parts of `.istm-context/architecture.md` and `.istm-context/design.md`
3. Read `node_modules/next/dist/docs/` for any Next.js 16 specific API used
4. Break the feature into small, ordered tasks
5. Explain the implementation plan
6. Ask questions if anything is unclear
7. Only then begin implementation

Never guess requirements. If anything is unclear, ask.

---

# Feature Development Process

Every feature should follow this workflow:

Understand
       ↓
Plan and break into tasks
       ↓
Implement task by task
       ↓
Verify the feature works correctly
       ↓
Refactor if needed
       ↓
Update progress.md

Never implement multiple unrelated features together.

---

# Mandatory Legacy Code Purge

Whenever an AI agent modifies, refactors, or replaces a feature or function, it must scan the full codebase and permanently remove all dead or legacy code, unused variables, outdated templates, and old fallback logic associated with that feature across all files.

---

# Frontend Layout and Text-Wrapping Safety

Before adding or changing frontend UI, verify the rendered parent width and alignment at desktop and mobile sizes.

- Do not make a flex or grid text wrapper shrink-to-fit accidentally. A content row that owns a full-width child should explicitly use `w-full min-w-0` when appropriate.
- Do not use `overflow-wrap: anywhere` for normal prose. It can reduce intrinsic width and cause a parent to collapse.
- Do not use display fonts at very small `max-w-*` values for body copy. Paragraphs should use the body font and a readable measure of around 65 characters per line.
- Do not hardcode UI surface, text, border, or semantic-state colors in components. Use the semantic tokens always.
- Shared buttons must use the Button component from `components/ui/button`. New button-like links should reuse existing Button before introducing a custom implementation.

---

# Empty States

Every empty state uses a Lucide icon (never an emoji), a short motivating headline, a one-line description, and a single primary CTA Button. No decorative illustrations. Clarity and action win.

Use the `EmptyState` shared component at `components/shared/EmptyState.tsx`.

---

# When Stuck

Never invent requirements. Never guess. Stop. Ask questions. Wait for clarification. Then continue.

---

# Definition of Done

A task is complete only when:
- Feature works correctly
- Code follows the architecture and folder structure in this file
- No hardcoded values outside of `globals.css` and `presence-colors.ts`
- All interactive elements use shadcn/ui primitives
- TypeScript compiles with zero errors
- No `any` types anywhere
- All inputs are validated with Zod
- Pages remain thin (routing layers only)
- progress.md is updated
