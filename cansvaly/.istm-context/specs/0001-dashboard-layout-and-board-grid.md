# Spec 0001: Dashboard Layout & Board Grid (UI Only)

**Status**: In Progress

## Summary & Requirements
This spec defines the frontend UI layout for the main Canvasly Dashboard (`app/(dashboard)`). It includes a collapsible sidebar, a top navigation header with search and user controls, a workspace switcher, a board grid with responsive card layouts, and empty/loading state primitives. 

This phase is **UI-Only** (mock data / client state stubs) to ensure perfect visual polish, responsive behavior, and design system compliance before wiring server actions and live database queries.

### Acceptance Criteria
1. **Sidebar Navigation**: Fixed left sidebar on desktop (240px wide), collapsible to icon-only mode (64px), and responsive mobile drawer via shadcn `Sheet`. Navigation items: *All Boards*, *Favorites*, *Shared with me*, *Settings*.
2. **Dashboard Header**: Top bar containing Search bar input (`Command` dialog trigger shortcut `cmd+K`), Organization Switcher placeholder, **+ New Board** primary action button, and User menu dropdown.
3. **Board Grid**: Responsive CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`).
4. **Board Card Atom**:
   - Aspect ratio 16:9 thumbnail preview container with hover elevation (`hover:shadow-md transition-shadow`).
   - Title, last edited timestamp, owner avatar.
   - Favorite star button toggle.
   - Overflow dropdown menu (`DropdownMenu`) for *Rename*, *Duplicate*, *Favorite*, *Delete*.
5. **Empty States**: Reusable `EmptyState` component displaying a Lucide icon, headline, description, and primary CTA when a category (e.g. Favorites or Shared) contains 0 items. No emojis or decorative images.
6. **Design System Adherence**: 100% Tailwind CSS v4 semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-muted`), shadcn UI primitives (`Card`, `Button`, `DropdownMenu`, `Input`, `Dialog`, `Sheet`, `Tooltip`, `Avatar`), zero hardcoded hex colors.

---

## Step 1: Global Setup (CSS & Layouts)
Verify `globals.css` and `layout.tsx` wrapper:
- Ensure `@theme` maps `--color-background`, `--color-card`, `--color-muted`, `--color-primary`, `--color-border`.
- `app/(dashboard)/layout.tsx` must wrap children in a flex container:
  ```tsx
  <div className="flex h-screen w-full overflow-hidden bg-background">
    <Sidebar />
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
  ```

---

## UI & Architecture

### Layout Hierarchy
```
app/(dashboard)/
├── layout.tsx                     — Dashboard shell layout (Sidebar + Header + main container)
├── page.tsx                       — Thin route rendering BoardGrid
├── boards/page.tsx                — Detailed boards view
components/
├── dashboard/
│   ├── Sidebar.tsx                — Left collapsible navigation bar
│   ├── DashboardHeader.tsx        — Top header with search, org switcher, and action buttons
│   ├── OrgSwitcher.tsx            — Clerk/Custom workspace switcher control
│   └── NewBoardButton.tsx         — Primary CTA button & dialog trigger
├── board/
│   ├── BoardCard.tsx              — 16:9 thumbnail board preview card with overflow options
│   ├── BoardGrid.tsx              — Grid container with sorting/filter tabs and empty state handling
│   └── BoardCardSkeleton.tsx      — Loading state skeleton matching card dimensions
└── shared/
    └── EmptyState.tsx             — Reusable empty state view with Lucide icons
```

### Component Specifications

#### 1. `components/dashboard/Sidebar.tsx`
- **State**: Controlled collapse state (Zustand `sidebarStore` or local React state).
- **Desktop**: 240px wide expanded, 64px collapsed.
- **Mobile**: Trigger button rendering shadcn `Sheet` menu overlay.
- **Tokens**: `bg-sidebar` or `bg-card`, `border-r border-border`.
- **Navigation Items**:
  - `LayoutGrid` icon: *All Boards*
  - `Star` icon: *Favorites*
  - `Users` icon: *Shared with me*
  - `Settings` icon: *Settings*
  - `User` icon: *Profile*

#### 2. `components/dashboard/DashboardHeader.tsx`
- **Height**: 56px (`TOPBAR_HEIGHT` constant from `lib/constants.ts`).
- **Elements**:
  - Search Input: `<Input placeholder="Search boards... (⌘K)" />`
  - Workspace indicator / `OrgSwitcher`
  - `<NewBoardButton />`
  - `<CustomUserButton />`

#### 3. `components/board/BoardCard.tsx`
- **Props**:
  ```typescript
  interface BoardCardProps {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    isFavorited: boolean;
    updatedAt: string;
    ownerName: string;
    ownerAvatar?: string;
    onFavoriteToggle?: (id: string) => void;
    onDelete?: (id: string) => void;
  }
  ```
- **Structure**:
  - Top: Relative container `aspect-video rounded-t-xl bg-muted overflow-hidden border-b border-border`. Renders thumbnail or fallback pattern.
  - Bottom: `p-3 flex items-center justify-between bg-card rounded-b-xl`.
  - Title: `text-sm font-semibold truncate text-foreground`.
  - Subtitle: `text-xs text-muted-foreground`.
  - Actions: `DropdownMenu` trigger button (ghost variant with `MoreHorizontal` icon).

#### 4. `components/shared/EmptyState.tsx`
- **Props**:
  ```typescript
  interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
  ```
- **Styling**: `flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card/50`.

---

## Strict Typing & Clean Code Standards
- 100% strict TypeScript. No `any` or loose type assertions.
- All icon components from `lucide-react`.
- All interactive controls use shadcn/ui components (`Button`, `DropdownMenu`, `Dialog`, `Input`, `Tooltip`).
- No hardcoded inline hex colors or arbitrary class names (`bg-[#...]`).
- Self-documenting code with zero noise comments.

---

## Step-by-Step Build Plan

1. **Create Shared Primitives & Utility Constants**:
   - Verify `lib/constants.ts` defines `TOPBAR_HEIGHT = 56` and `SIDEBAR_WIDTH = 240`.
   - Implement `components/shared/EmptyState.tsx`.

2. **Build Sidebar & Dashboard Header Shell**:
   - Create `components/dashboard/Sidebar.tsx` with desktop & mobile sheet modes.
   - Create `components/dashboard/DashboardHeader.tsx` with search input and action triggers.
   - Create `app/(dashboard)/layout.tsx` wrapping the shell.

3. **Build Board Card & Grid Components**:
   - Implement `components/board/BoardCard.tsx` with 16:9 thumbnail preview & overflow actions.
   - Implement `components/board/BoardCardSkeleton.tsx`.
   - Implement `components/board/BoardGrid.tsx` with tab filters (*All Boards*, *Favorites*, *Shared*).

4. **Integrate Dashboard Page**:
   - Update `app/(dashboard)/page.tsx` and `app/(dashboard)/boards/page.tsx` with mock board data to render the complete interactive UI.

5. **Verify Visual Polish & Responsive Behavior**:
   - Test layout across desktop (1440px), tablet (768px), and mobile (375px).

---

## Completion Instruction
Do not run implementation code during spec generation. Once approved, run `/istm-develop` to execute this build plan.
