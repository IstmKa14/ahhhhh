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

### Auth & User Flows (Clerk)
- [x] `@clerk/nextjs` installed & configured
- [x] `.env.local` — Created with Clerk API key placeholders
- [x] `proxy.ts` — Next.js 16 `proxy` file convention with `clerkMiddleware()` protecting non-public routes and redirecting unauthenticated users to `/`
- [x] `app/layout.tsx` — Wrapped in `<ClerkProvider>` inside `<body>`
- [x] `app/page.tsx` — Header updated with `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton>`
- [x] `app/(dashboard)/dashboard/page.tsx` — Protected workspace dashboard route with `<UserButton />` and board grid empty state
- [x] `app/(auth)/sign-in/[[...sign-in]]/page.tsx` — Minimal sign in UI with Google SSO, email/password custom auth logic, loading spinner states (`fetchStatus`), and structured error banners
- [x] `app/(auth)/sign-up/[[...sign-up]]/page.tsx` — Minimal sign up UI with Google SSO, registration, 6-digit email OTP verification step, loading spinner states (`fetchStatus`), and structured error banners
- [x] Added `clerk/skills` suite (20 specialized skills) to `.agents/skills/`
- [x] Added `liveblocks/skills` suite (`liveblocks-best-practices`, `yjs-best-practices`) to `.agents/skills/`

---

## 🔄 In Progress

Nothing currently in progress.

---

## 📋 Pending — Ordered by Priority

### Database (Drizzle + Neon)
- [x] Install `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`
- [x] `db/index.ts` — Neon serverless HTTP client configured
- [x] `db/schema.ts` — defined `users`, `organizations`, `boards`, `board_members` tables
- [x] `drizzle.config.ts` — configured Drizzle Kit for Neon migrations
- [x] Executed `drizzle-kit push` to sync schema (`users`, `organizations`, `boards`, `board_members`) to Neon database

### User Store & Custom Profile (Clerk Sync + Drizzle)
- [x] `stores/userStore.ts` — Zustand store for user client state
- [x] `app/(dashboard)/profile/actions.ts` — Server actions for syncing Clerk user ID to Neon DB and updating profile metadata
- [x] `app/(dashboard)/profile/ProfileForm.tsx` — Custom user profile component using `@/components/ui/avatar` primitive
- [x] `app/(dashboard)/profile/page.tsx` — Protected custom user profile page route
- [x] `components/dashboard/CustomUserButton.tsx` — Custom user menu dropdown using shadcn primitives (`DropdownMenu`, `Avatar`)
- [x] Configured Clerk authentication redirect environment variables (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, etc.)
- [x] `app/(auth)/onboarding/page.tsx` — Minimal onboarding flow after registration (`/onboarding`)

### Dashboard & Product Modals
- [x] `app/(dashboard)/layout.tsx` — sidebar + main area shell layout with mounted modals
- [x] `app/(dashboard)/page.tsx` — interactive board grid with filter tabs & Unsplash photography thumbnails
- [x] `app/(dashboard)/boards/page.tsx` — redirect route to main dashboard
- [x] `app/(dashboard)/settings/page.tsx` — workspace settings route (profile, canvas defaults, notifications)
- [x] `components/dashboard/Sidebar.tsx` — fixed desktop sidebar (collapsible) + mobile sheet drawer
- [x] `components/dashboard/DashboardHeader.tsx` — top header with search input, workspace badge, CTA, user button
- [x] `components/dashboard/NewBoardButton.tsx` — create board button primitive triggering modal store
- [x] `components/board/BoardCard.tsx` — 16:9 thumbnail preview + title + favorite toggle + overflow actions with Share modal trigger
- [x] `components/board/BoardCardSkeleton.tsx` — loading skeleton for board cards
- [x] `components/board/BoardGrid.tsx` — responsive grid layout with filter tabs
- [x] `components/shared/EmptyState.tsx` — reusable empty state component with Lucide icons
- [x] `components/shared/CustomIcons.tsx` — dedicated SVG vector icons (`CanvasGridIcon`, `MagicSparkleIcon`, `BrainstormNodeIcon`, `LockShieldIcon`, `TeamUsersIcon`)
- [x] `components/modals/NewBoardModal.tsx` — multi-step board creation modal with starter template picker, access level toggles & accent colors
- [x] `components/modals/SearchCommandModal.tsx` — `⌘K` / `Ctrl+K` command palette modal
- [x] `components/modals/ShareModal.tsx` — invite collaborators by email and link sharing modal
- [x] `stores/sidebarStore.ts` — Zustand store for sidebar collapse state
- [x] `stores/modalStore.ts` — Zustand store for modal state management (`newBoard`, `search`, `share`)
- [x] `lib/constants.ts` — layout dimension constants (`TOPBAR_HEIGHT`, `SIDEBAR_WIDTH`)

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

### Server Actions & Database Integration
- [x] `lib/validations.ts` — Zod schemas for all Server Action inputs (`createBoardSchema`, `renameBoardSchema`, `inviteCollaboratorSchema`)
- [x] `app/(dashboard)/actions.ts` — Drizzle ORM queries and Server Actions:
  - `createBoardAction` — creates board record in Neon DB & owner in `board_members`
  - `getBoardsAction` — queries boards with filters (`all`, `favorites`, `shared`)
  - `renameBoardAction` — renames board title in Neon DB
  - `deleteBoardAction` — deletes board record from Neon DB
  - `searchBoardsAction` — real-time ILIKE query for `⌘K` command palette
  - `inviteCollaboratorAction` — adds user to `board_members`
- [x] `app/(dashboard)/page.tsx` — connected to real Neon DB boards via `getBoardsAction`
- [x] `components/modals/NewBoardModal.tsx` — wired to `createBoardAction`
- [x] `components/modals/SearchCommandModal.tsx` — wired to `searchBoardsAction`
- [x] `components/modals/ShareModal.tsx` — wired to `inviteCollaboratorAction` with dynamic room links and email invitation access
- [x] `components/modals/RenameModal.tsx` — dedicated rename modal replacing native confirm dialogs
- [x] `components/modals/DeleteModal.tsx` — dedicated delete confirmation modal replacing native confirm dialogs
- [x] `duplicateBoardAction` in `app/(dashboard)/actions.ts` — creates copy of board titled `Title copy(1)`

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
| 2 | Deprecated `middleware.ts` Next.js 16 warning — migrated to `proxy.ts` | ✅ Fixed |
| 3 | Missing `dequal` dependency in `@clerk/shared` package | ✅ Fixed |
| 4 | Deprecated `afterSignOutUrl` prop in `<UserButton />` | ✅ Fixed |
| 5 | Invalid Server Action origin mismatch on Codespaces proxy | ✅ Fixed |

---

## 📦 Installed Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.3.2 | Framework |
| `react` | 19.2.8 | UI runtime |
| `@clerk/nextjs` | ^7.8.0 | Authentication & session management |
| `dequal` | ^2.0.3 | Deep equality checker for Clerk shared utils |
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
