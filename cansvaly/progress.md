# Canvasly — Progress Tracker

Last updated: 2026-08-22

---

## ✅ Completed

### Foundation & Tooling
- [x] Next.js 16.3.2 project scaffolded with App Router and TypeScript
- [x] Tailwind CSS v4 configured with `@tailwindcss/postcss`
- [x] Geist Sans + Geist Mono fonts loaded via `next/font/google` in root layout
- [x] shadcn/ui installed (base-nova style, Tailwind v4 CSS vars, Lucide icons)
- [x] `components.json` configured with correct `@/*` alias paths
- [x] `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Design System & Landing Page
- [x] `app/globals.css` — full Canvasly token system:
  - Light + dark mode CSS variables for all 16 semantic tokens
  - `@theme inline` block mapping every Tailwind utility class
  - Brand primary: indigo-violet `#5b4eff` (light) / `#7b6fff` (dark)
  - Border radius scale: sm (4px) → full (9999px)
  - Sidebar tokens for shadcn/ui sidebar component
  - Base layer resets (`border-border`, `bg-background`, `font-sans`)
- [x] `lib/presence-colors.ts` — 6 collaboration colors + deterministic `getPresenceColor(userId)` helper
- [x] `/design-system` route — full token showcase page with:
  - Surface, brand, semantic color swatches
  - Collaboration presence color palette
  - Type scale (display → caption → mono code)
  - Border radius scale
  - Elevation / shadow levels
  - Button all variants + sizes
  - Motion tokens
  - Spacing scale (8px grid)
  - Dark mode toggle (sticky top bar, moon/sun icon, toggles `.dark` on `<html>`)
- [x] `components/shared/Logo.tsx` — Canvasly SVG wordmark and icon mark
- [x] `app/page.tsx` — Landing page with sticky navbar, hero section, canvas preview strip, 3-column features grid, and CTA banner (wired with Next.js navigation to `/sign-in` and `/sign-up`)

### Project Structure
- [x] Root-level folder structure established (no `src/` wrapper):
  - `components/ui/` — shadcn/ui primitives
  - `components/canvas/`, `board/`, `dashboard/`, `shared/` — domain folders (empty stubs)
  - `lib/` — utilities
  - `hooks/`, `stores/`, `types/`, `db/`, `drizzle/` — stubs ready
- [x] `tsconfig.json` — `@/*` path alias pointing to project root

### Documentation
- [x] `GEMINI.md` — AI agent working instructions (updated: no `src/` wrapper)
- [x] `CLAUDE.md` — mirror of GEMINI.md (updated: no `src/` wrapper)
- [x] `.istm-context/agents.md` — agent context (updated: no `src/` wrapper)
- [x] `.istm-context/architecture.md` — system architecture (updated: no `src/` wrapper)
- [x] `.istm-context/design.md` — design system tokens and rules
- [x] `.istm-context/project-overview.md` — product overview

### Repository
- [x] Git history established with clean, scoped commits
- [x] Remote set to `https://github.com/IstmKa14/ahhhhh`
- [x] Monorepo root at `/workspaces/ahhhhh/` with two folders:
  - `cansvaly/` — this project
  - `mindbllom/` — separate existing project
- [x] Root is clean — only `cansvaly/` and `mindbllom/` at root level

---

### Auth UI Pages
- [x] `app/(auth)/sign-in/[[...sign-in]]/page.tsx` — Split-screen login UI (Google OAuth button, Email/Password inputs, feature highlights, responsive layout)
- [x] `app/(auth)/sign-up/[[...sign-up]]/page.tsx` — Split-screen signup UI (Google OAuth button, Name & Email/Password inputs, social proof highlights, responsive layout)

---

## 🔄 In Progress

Nothing currently in progress.

---

## 📋 Pending — Ordered by Priority

### Auth (Clerk)
- [x] Installed `@clerk/nextjs` & `@clerk/ui`
- [x] `.env.local` — Created with Clerk API key placeholders
- [x] `middleware.ts` — `clerkMiddleware()` protecting `/(dashboard)` and `/board/` routes with proxy matcher
- [x] `app/layout.tsx` — Wrapped in `<ClerkProvider>` inside `<body>`
- [x] `app/(dashboard)/dashboard/page.tsx` — Protected workspace dashboard route with `<UserButton />` and board grid empty state
- [x] `app/page.tsx` — Header updated with `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton>`
- [x] `app/(auth)/sign-in/[[...sign-in]]/page.tsx` — Minimal sign in UI page
- [x] `app/(auth)/sign-up/[[...sign-up]]/page.tsx` — Minimal sign up UI page

### Database (Drizzle + Neon)
- [ ] Install `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`
- [ ] Add `DATABASE_URL` to `.env.local`
- [ ] `db/index.ts` — Neon serverless client
- [ ] `db/schema.ts` — define `users`, `organizations`, `boards`, `board_members` tables
- [ ] Run `drizzle-kit push` to sync schema

### Dashboard
- [ ] `app/(dashboard)/layout.tsx` — sidebar + main area layout
- [ ] `app/(dashboard)/page.tsx` — redirect to boards or org home
- [ ] `app/(dashboard)/boards/page.tsx` — board grid with create button
- [ ] `components/dashboard/Sidebar.tsx` — fixed sidebar, collapsible to icon-only
- [ ] `components/dashboard/OrgSwitcher.tsx` — Clerk org switcher
- [ ] `components/dashboard/NewBoardButton.tsx` — create board dialog trigger
- [ ] `components/board/BoardCard.tsx` — thumbnail + title + overflow menu
- [ ] `components/board/BoardGrid.tsx` — responsive grid layout
- [ ] `components/shared/EmptyState.tsx` — reusable empty state component
- [ ] `components/shared/Logo.tsx` — Canvasly SVG wordmark

### Board Canvas (tldraw + Liveblocks)
- [ ] Install `tldraw`, `@tldraw/sync`, `liveblocks`
- [ ] Add `LIVEBLOCKS_SECRET_KEY` to `.env.local`
- [ ] `lib/liveblocks.ts` — Liveblocks client config
- [ ] `app/api/liveblocks-auth/route.ts` — room JWT issuer (Node.js runtime)
- [ ] `app/board/[boardId]/page.tsx` — thin page rendering Canvas
- [ ] `app/board/[boardId]/loading.tsx` — full-screen skeleton
- [ ] `components/canvas/Canvas.tsx` — tldraw loaded via `next/dynamic({ ssr: false })`
- [ ] `components/canvas/Toolbar.tsx` — custom CanvaslyToolbar overriding tldraw default
- [ ] `components/canvas/Cursors.tsx` — collaborator cursor overlay at z-50
- [ ] `components/canvas/Presence.tsx` — avatar bar in top bar (up to 4 + N more)

### Liveblocks Presence
- [ ] `hooks/usePresence.ts` — broadcast cursor position, selected shapes, user metadata
- [ ] `types/liveblocks.ts` — typed presence schema
- [ ] Cursor throttle at 16ms (`CURSOR_THROTTLE_MS` constant)

### Zustand Stores
- [ ] `stores/toolbarStore.ts` — active tool, stroke/fill color, stroke width
- [ ] `stores/modalStore.ts` — which modal is open + payload
- [ ] `stores/sidebarStore.ts` — collapsed state, active nav section

### Server Actions
- [ ] `app/(dashboard)/boards/actions.ts` — create, rename, delete board
- [ ] `app/(dashboard)/org/[orgId]/actions.ts` — invite member, update role

### File Storage (S3 + ImageKit)
- [ ] Install `@aws-sdk/client-s3`
- [ ] `lib/s3.ts` — presigned URL generation
- [ ] `lib/imagekit.ts` — CDN transform client
- [ ] `app/api/upload/route.ts` — presigned URL endpoint
- [ ] `app/api/liveblocks-webhook/route.ts` — `storageUpdated` → thumbnail → S3

### API Routes
- [ ] `app/api/boards/route.ts` — GET list, POST create
- [ ] `app/api/boards/[boardId]/route.ts` — GET, PATCH, DELETE
- [ ] `app/api/export/[boardId]/route.ts` — PNG/SVG export via `exportToBlob()`

### Hooks & Utilities
- [ ] `hooks/useBoard.ts` — board data fetching helper
- [ ] `hooks/useUpload.ts` — S3 upload hook
- [ ] `lib/constants.ts` — `TOOLBAR_WIDTH`, `TOPBAR_HEIGHT`, `CURSOR_THROTTLE_MS`, `THUMBNAIL_TRANSFORM`
- [ ] `lib/validations.ts` — Zod schemas for all Server Action inputs

### Types
- [ ] `types/board.ts` — board, member, role types inferred from Drizzle
- [ ] `types/user.ts` — user type inferred from Drizzle
- [ ] `types/liveblocks.ts` — presence and storage types

---

## 🐛 Known Issues / Error Memory

See `error-memory.md` for detailed bug history.

| # | Symptom | Status |
|---|---------|--------|
| 1 | `/design-system` parse error line 240 — duplicate JSX left after edit | ✅ Fixed |

---

## 📦 Installed Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.3.2 | Framework |
| `react` | 19.2.8 | UI runtime |
| `tailwindcss` | ^4 | Styling |
| `@tailwindcss/postcss` | ^4 | Tailwind PostCSS plugin |
| `shadcn` (CLI) | 4.19.0 | Component installer |
| `@base-ui-components/react` | — | shadcn base-nova primitives |
| `class-variance-authority` | — | Component variants |
| `clsx` | — | Class merging |
| `tailwind-merge` | — | Tailwind class deduplication |
| `tw-animate-css` | — | Animation utilities |
| `lucide-react` | — | Icon library |
| `typescript` | ^5 | Type safety |
