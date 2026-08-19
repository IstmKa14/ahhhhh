# MindBloom Design DNA

This document defines the premium editorial and minimalist design system for MindBloom. It guides all visual layouts, styling details, and interactive elements.

## Strategy

The interface feels like a high end magazine or a classic printed journal. We replace bright digital colors and complex movements with structured grids, large elegant typography, and quiet colors. 

## Design System

### Colors

Our colors are inspired by natural elements and raw paper.

* Primary: `#1A2F25` (Deep forest ink, used for headings, primary text, and dark blocks)
* Secondary: `#8FA89B` (Muted leaves, used for secondary text, labels, and borders)
* Accent: `#DCA482` (Warm terracotta, used for highlights, active tabs, and primary actions)
* Background: `#FBFBF9` (Warm linen paper, the base color for all pages)
* Card: `#F5F4EE` (Slightly darker stone paper, used for cards and surfaces)
* Border: `#E3E1D9` (Subtle grey, used for structural lines and dividers)

We do not use raw hex codes in our code files. We assign them to CSS custom variables.

### Typography

Typography is the main design element. We use two main fonts.

* Heading Font: `Cormorant Garamond` (An elegant classic serif)
* Body Font: `Plus Jakarta Sans` (A clean contemporary sans serif)

We import these fonts from Google Fonts.

#### Typography Scale

* Display: `3.75rem` (60px), font weight 300, line height 1.15
* Heading 1: `2.5rem` (40px), font weight 400, line height 1.2
* Heading 2: `1.875rem` (30px), font weight 400, line height 1.25
* Heading 3: `1.5rem` (24px), font weight 500, line height 1.3
* Body: `1rem` (16px), font weight 400, line height 1.6
* Small Body: `0.875rem` (14px), font weight 400, line height 1.5
* Overline: `0.75rem` (12px), font weight 600, uppercase, letter spacing 0.05em

### Spacing and Layout

We use wide spaces to let the layout breathe.

* Base Unit: `4px`
* Spacing Scale: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`
* Content Density: comfortable, spacious, with clear focus
* Alignment: asymmetric, grid oriented, editorial

### Shapes and Borders

We avoid heavy round corners. We prefer sharp and structured shapes.

* Border Radius Small: `2px` (used for buttons and inputs)
* Border Radius Medium: `4px` (used for small cards)
* Border Radius Large: `8px` (used for sections and main blocks)
* Borders: We use 1px solid borders (`#E3E1D9`) to define grids instead of using shadows.

### Elevation

* Shadows: We do not use drop shadows. We use flat borders and layered offset boxes for depth.

### Motion

* Philosophy: Quiet, functional, elegant.
* Transitions: We use simple fades or quick vertical shifts. We do not use bouncy animations. We do not use heavy scroll effects.
* Duration: 200ms or 300ms.
