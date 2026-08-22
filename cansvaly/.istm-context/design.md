# Canvasly Design System, Tokens, Layout Rules, and Component Registry

This document is the single source of truth for every interface, interaction, and component. Every design decision should reinforce clarity, collaboration, and speed.

---

# Part 1: Core Principles and Golden Rules

## Simplicity
Design should reveal only what the user needs in the current moment. Hide unnecessary complexity, reduce cognitive load, and guide users one decision at a time without sacrificing power.

## Fluidity
Every interaction should feel connected. Elements should transform naturally instead of appearing or disappearing abruptly, helping users always understand where they came from and where they are going.

## Consistency
Users should never have to relearn the interface. Similar actions, layouts, and components should always behave in predictable ways.

## Accessibility
Accessibility is a design requirement, not a feature. Every interface should be usable by as many people as possible regardless of ability or device.

---

## Golden Rules
Every design should:
- Focus on one primary action.
- Reveal complexity progressively.
- Reuse existing shadcn/ui components.
- Preserve user context.
- Explain changes through motion.
- Prioritize readability.

---

# Part 2: Design Tokens

Never hardcode colors, spacing, typography, radius values, or shadows. Always use these design tokens defined via Tailwind v4 `@theme` blocks and CSS custom properties.

## Design Personality

The application should feel:
- Fast and fluid (zero-lag canvas interactions)
- Collaborative (presence indicators everywhere)
- Clean and focused (minimal chrome, maximal canvas space)
- Professional and trustworthy (design tool aesthetic, not a toy)
- Slightly warm (not cold and clinical)

The UI should feel like a professional design workspace rather than a generic software dashboard.

## Colors

All colors are defined in `app/globals.css` via `@theme` and CSS custom properties. Use the Tailwind semantic utility classes only. Never use raw hex values in component code.

### Semantic Token Map

The project uses a dark-primary canvas aesthetic with light surfaces for chrome (sidebar, topbar, dialogs).

```css
@theme {
  /* Canvas and page background */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* Card and panel surfaces */
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  /* Muted backgrounds (sidebar sections, empty states) */
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  /* Primary accent (Canvasly indigo-violet) */
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  /* Secondary accent (neutral slate) */
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  /* Destructive (danger actions) */
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  /* Borders and dividers */
  --color-border: var(--border);

  /* Input backgrounds */
  --color-input: var(--input);

  /* Focus rings */
  --color-ring: var(--ring);

  /* Accent hover states */
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  /* Popover and dropdown surfaces */
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
}
```

### Concrete CSS Variables (defined once in globals.css, light and dark)

Light mode:
- `--background`: #ffffff
- `--foreground`: #0f0f11
- `--card`: #ffffff
- `--card-foreground`: #0f0f11
- `--muted`: #f4f4f6
- `--muted-foreground`: #6b6b78
- `--primary`: #5b4eff (indigo-violet — the Canvasly brand accent)
- `--primary-foreground`: #ffffff
- `--secondary`: #f0f0f5
- `--secondary-foreground`: #0f0f11
- `--destructive`: #ef4444
- `--destructive-foreground`: #ffffff
- `--border`: #e4e4ea
- `--input`: #e4e4ea
- `--ring`: #5b4eff
- `--accent`: #f0f0f5
- `--accent-foreground`: #0f0f11
- `--popover`: #ffffff
- `--popover-foreground`: #0f0f11

Dark mode (canvas chrome):
- `--background`: #09090b
- `--foreground`: #fafafa
- `--card`: #141418
- `--card-foreground`: #fafafa
- `--muted`: #1c1c22
- `--muted-foreground`: #8e8e9a
- `--primary`: #7b6fff (lighter indigo for dark backgrounds)
- `--primary-foreground`: #ffffff
- `--secondary`: #1c1c22
- `--secondary-foreground`: #fafafa
- `--destructive`: #f87171
- `--destructive-foreground`: #ffffff
- `--border`: #27272f
- `--input`: #27272f
- `--ring`: #7b6fff
- `--accent`: #1c1c22
- `--accent-foreground`: #fafafa
- `--popover`: #141418
- `--popover-foreground`: #fafafa

### Collaboration Presence Colors
Each collaborator gets a deterministic color from their user ID. The palette is:
- Coral: `#ff6b6b`
- Teal: `#06d6a0`
- Amber: `#ffd166`
- Sky: `#118ab2`
- Rose: `#ef476f`
- Lavender: `#9d8df1`

These are hardcoded in `lib/presence-colors.ts` as a constant array. They are the only hex values permitted outside of `globals.css`.

## Typography

### Font Family
- Primary Font: Geist Sans (`--font-geist-sans`, loaded via `next/font/google`)
- Monospace Font: Geist Mono (`--font-geist-mono`, loaded via `next/font/google`)
- Fallback: system-ui, sans-serif

Both are already defined in `app/layout.tsx`. Extend the `@theme` block in `globals.css` to map them:
```css
@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Type Scale (Tailwind v4 semantic classes)
- Display / Hero H1: `text-5xl font-bold tracking-tight` (desktop), `text-3xl` (mobile)
- Section H2: `text-3xl font-semibold tracking-tight`
- Card H3: `text-xl font-semibold`
- Body Large: `text-base leading-7`
- Body Small: `text-sm leading-6`
- Caption / Label: `text-xs font-medium text-muted-foreground`
- Code: `font-mono text-sm`

### Text Wrapping Safety
- Never set `overflow-wrap: anywhere` on prose containers
- Body copy containers must use `max-w-prose` or an explicit character measure (around 65ch)
- All text wrappers in flex or grid rows must use `min-w-0` to prevent shrink-to-fit

## Spacing Scale (8px grid, Tailwind defaults)
- XS: `p-1` (4px)
- SM: `p-2` (8px)
- MD: `p-4` (16px)
- LG: `p-6` (24px)
- XL: `p-8` (32px)
- 2XL: `p-12` (48px)
- 3XL: `p-16` (64px)

## Shadows and Elevation
- Level 1 (Card): `shadow-sm` (subtle lift, board thumbnails)
- Level 2 (Floating toolbar): `shadow-md` (canvas toolbar, floating panels)
- Level 3 (Modal): `shadow-xl` (dialogs, command menus)
- Level 4 (Elevated overlay): `shadow-2xl` (dropdown menus over canvas)

## Border Radius
- Sharp (inputs, tags): `rounded` (4px)
- Standard cards and panels: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Pills and avatars: `rounded-full`
- Board thumbnails: `rounded-xl`

---

# Part 3: Visual Styling and Layout Rules

## Design Principles
- Visual Language: The interface must feel like a professional design workspace. Every surface should feel intentional and every chrome element should maximize the canvas space.
- Layout Structure: Dashboard follows a fixed sidebar plus scrollable main content pattern. The canvas page is full-bleed with floating chrome.
- Typography Hierarchy: Weight carries hierarchy. Use `font-bold` only for display text. Use `font-semibold` for section and card titles. Use `font-medium` for labels and nav items. Body copy is `font-normal`.
- Empty State Rules: Every empty state must display a Lucide icon, a short motivating headline, a one-line description, and a single primary CTA button. No emojis. No decorative images.
- Prohibited Layout Styles: No centered single-column layouts for dashboard content. No full-page spinners. No inline styles. No hardcoded colors in component files.

## Canvas Page Layout Rules
- The tldraw canvas fills 100% of the viewport height and width with no margin or padding
- Floating chrome (toolbar, top bar, presence bar, zoom controls) must use `absolute` or `fixed` positioning with appropriate z-index values defined in the token system
- The top bar height is 56px. The toolbar width is 56px. These are constants defined in `lib/constants.ts`
- On mobile (below 768px) the canvas toolbar collapses to a bottom sheet

## Dashboard Layout Rules
- Sidebar is fixed, 240px wide on desktop, collapsible to 64px (icon-only mode)
- Main content area uses `flex-1 min-w-0 overflow-auto`
- Board grid uses `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- Board cards are square with a 16:9 thumbnail area plus a metadata footer

## Whitespace Philosophy
Generous whitespace in chrome. Minimal whitespace on the canvas (the tldraw canvas owns all space). Every dashboard section header has `mb-6` above the content. Cards have `p-4` internal padding.

---

# Part 4: UI Component Registry

Always use these component structures. Duplicate component declarations are not allowed. Shadcn/ui components in `components/ui/` are the authority for all primitives.

## Buttons
- `Button` variant `default`: Background `bg-primary`, text `text-primary-foreground`, rounded `rounded-lg`. Used for primary CTAs.
- `Button` variant `secondary`: Background `bg-secondary`, text `text-secondary-foreground`. Used for secondary actions.
- `Button` variant `destructive`: Background `bg-destructive`, text `text-destructive-foreground`. Used exclusively for irreversible actions.
- `Button` variant `ghost`: No background, hover `bg-accent`. Used for icon buttons in toolbars and nav items.
- `Button` variant `outline`: Bordered, no background. Used for secondary CTAs on marketing pages.

## Cards
- `Card` (shadcn/ui): Background `bg-card`, border `border-border`, `rounded-xl`, `shadow-sm`. Used for board cards and dashboard panels.
- `BoardCard`: Extends `Card`. Has a 16:9 thumbnail area (top), a footer with title and metadata (bottom), and an overflow menu trigger.

## Inputs
- `Input` (shadcn/ui): Standard input with `border-input`, `bg-input`, focus ring `ring-ring`. Use for all text inputs.
- `Textarea` (shadcn/ui): For multi-line content like board descriptions and comments.

## Dialogs and Modals
- `Dialog` (shadcn/ui): For Share, Export, Delete Confirm, and Board Settings modals.
- `Sheet` (shadcn/ui): For the mobile sidebar and the comments panel on mobile.

## Dropdowns and Menus
- `DropdownMenu` (shadcn/ui): For overflow menus on board cards and member role selectors.
- `Select` (shadcn/ui): For role selectors in the invite form.
- `Command` + `CommandDialog` (shadcn/ui): For the board search palette (cmd+K).

## Tooltips
- `Tooltip` (shadcn/ui): Wrap every icon button in the canvas toolbar and dashboard nav with a tooltip showing the label and keyboard shortcut.

## Avatars
- `Avatar` (shadcn/ui): Used for user presence indicators, board member lists, and the top bar user menu.
- Presence avatars use a color ring matching the user's collaboration color from the presence color palette.

## Layout Containers
- `screen-container`: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` — used on marketing pages.
- `dashboard-main`: `flex-1 min-w-0 overflow-auto p-6` — used for the scrollable dashboard content area.
- `canvas-container`: `fixed inset-0 w-full h-full` — used for the board canvas page.

## Skeleton and Loading States
- Use `Skeleton` (shadcn/ui) for board thumbnails loading in the dashboard grid
- The board canvas uses a `loading.tsx` file with a full-screen skeleton that mimics the canvas chrome

## Empty States
Pattern: centered flex column, Lucide icon at 48px with `text-muted-foreground`, `text-lg font-semibold` headline, `text-sm text-muted-foreground` description, primary `Button` CTA. Never use emojis.

---

# Part 5: Canvas-Specific UI Rules

## tldraw Integration
- Wrap tldraw's `Tldraw` component with a custom UI override to inject the Canvasly toolbar
- Use `components` prop to replace the default toolbar: `{ Toolbar: CanvaslyToolbar }`
- Do not override tldraw's context menu or keyboard shortcuts unless a specific product requirement demands it
- The tldraw canvas background should match the app's background token in light mode and a slightly warm dark gray in dark mode

## Cursor Overlay
- Render collaborator cursors in a `div` positioned absolute over the canvas at `z-50`
- Cursor labels show the first name only, truncated to 12 characters
- Cursors animate with `transition-transform duration-75` for smooth movement
- Cursors fade out after 5 seconds of inactivity

## Presence Avatar Bar
- Located in the top bar, right of the board title
- Shows up to 4 avatars, then "+N more" as a count badge
- Clicking the avatar bar opens a presence panel listing all active users

---

# Part 6: Responsive Behavior and Breakpoints

## Breakpoints Matrix
- Desktop XL (1440px+): Full sidebar, 4-column board grid, full canvas chrome
- Desktop (1024px): Sidebar collapsible, 3-column board grid
- Tablet (768px): Sidebar collapses to icon-only, 2-column board grid, canvas toolbar moves to bottom
- Mobile (below 768px): Sidebar becomes a Sheet overlay, 1-column board grid, canvas toolbar is a bottom sheet, comments panel is a full-screen sheet

## Touch Targets
Minimum 44px for all interactive elements on touch devices. Icon buttons in the canvas toolbar must be at least 44x44px on mobile.

---

# Part 7: Motion and Animation

## Standard Motion Tokens
All transitions use these values. Never hardcode durations or easings:
- `duration-fast`: 150ms (hover states, tooltip reveals)
- `duration-base`: 200ms (button state changes, focus rings)
- `duration-slow`: 300ms (modal open/close, panel slide-in)
- `ease-out`: used for entrances (elements moving into view)
- `ease-in`: used for exits (elements moving out of view)
- `ease-in-out`: used for state transitions (toggle, collapse)

## Tailwind Animation Classes
- Hover on board cards: `hover:shadow-md transition-shadow duration-200`
- Button hover: `hover:opacity-90 transition-opacity duration-150`
- Sidebar collapse: `transition-all duration-300 ease-in-out`
- Dialog open: use shadcn/ui's built-in Radix animation (already configured)
- Cursor movement on canvas: `transition-transform duration-75 ease-out`
- Skeleton pulse: `animate-pulse`

## Rules
- No bounce or spring animations for functional UI (reserve those for empty state illustrations if any are added later)
- No animation on initial page load content (data should feel instantly available)
- Reduce motion: all transitions must respect `prefers-reduced-motion`. Use Tailwind's `motion-safe:` and `motion-reduce:` variants

---

# Part 8: Asset Strategy

No custom illustration files. All UI and empty states must be built using:
- Lucide React icon library for all icons (never emojis)
- CSS-driven color blocks and typography for empty states
- Board thumbnails generated programmatically via tldraw export and stored in S3 via ImageKit

Do NOT use image files for UI decoration. The one exception is the Canvasly wordmark/logo, which should be an SVG inline component at `components/shared/Logo.tsx`.

---

# Part 9: Do's and Don'ts

DO:
- Use `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `border-border` for all surface and text values
- Use shadcn/ui primitives for every interactive element
- Wrap every icon-only button in a Tooltip
- Test every screen at 375px (iPhone SE), 768px (iPad), and 1440px (desktop XL)
- Use `next/dynamic` for tldraw to avoid SSR errors

DON'T:
- Use hardcoded hex values in component files (only allowed in `globals.css` and `lib/presence-colors.ts`)
- Use `bg-[var(--background)]` or similar arbitrary variable syntax in Tailwind classes
- Use emojis in any UI element, empty state, or notification
- Add `'use client'` to a page file when only a child component needs interactivity
- Render the tldraw canvas in a Server Component context
