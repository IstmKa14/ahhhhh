# Spec 0002 — Landing Page Pixel-Faithful Rebuild

## Status: READY FOR BUILD

---

## 1. Summary & Goal

Rebuild the MindBloom landing page so it matches `image.png` exactly — same layout, same typography hierarchy, same visual weight, same spatial rhythm. The current page has the right section count but wrong content, wrong layout proportions, and missing sections. This spec governs a complete section-by-section replacement.

**The single constraint**: pixel-faithful visual parity with the reference image. No creative deviation. No extra sections. No removal of sections. Every word of copy, every visual cue, every structural detail in the image must be reproduced.

**Animations are additive**: after visual parity is achieved, GSAP + Lenis animations are layered on top. The markup must carry animation-class hooks from day one so the animator can attach motion without touching layout code.

---

## 2. Acceptance Criteria

- [ ] Navbar renders: `MINDBLOOM` wordmark left, nav links `EXPLORE / ABOUT / RESOURCES / SIGN IN` center-right, hamburger icon far right.
- [ ] All 11 numbered sections render in order (01–11) with the correct section label beneath the number.
- [ ] Every section uses exactly the copy shown in the image.
- [ ] Color, font family, and font weight match the design tokens — no hardcoded hex values.
- [ ] Dark sections (04 TALK, 06 RESET) use `bg-foreground text-background`.
- [ ] Light sections use `bg-background text-foreground`.
- [ ] Section numbers and labels use `font-sans text-[10px] font-medium tracking-widest uppercase`.
- [ ] Large section headlines use `font-serif`.
- [ ] All body copy and UI labels use `font-sans`.
- [ ] Every section has an `id` attribute and a matching `data-animate` attribute on animatable elements.
- [ ] No inline styles. No hardcoded colors.
- [ ] All image slots use `next/image` with `alt` text and an `object-cover` wrapper.
- [ ] Mobile layout collapses gracefully (single column, no overflow).

---

## 3. Section Inventory (from image, top to bottom)

| # | Label | Background | Key Content |
|---|-------|-----------|------------|
| — | Navbar | bg-background | Wordmark, nav links, hamburger |
| 01 | INTRO | bg-background | Hero headline, subtitle, CTA button |
| 02 | THE FEELING | bg-background | Left text block + stacked keyword pills, right full-bleed photo |
| 03 | OUR SPACE | bg-background | Left headline + body, botanical illustration right |
| 04 | TALK | bg-foreground (dark) | Left headline + body, right chat UI card, background texture photo |
| 05 | REFLECT | bg-background | Left headline + body + CTA link, center botanical illustration, right journal photo |
| 06 | RESET | bg-foreground (dark) | Left headline + tagline, right 3 circular icon pills: BREATHE / FOCUS / UNWIND |
| 07 | DISCOVER | bg-background | Left headline + CTA link, right 5 mood photo cards with labels |
| 08 | PHILOSOPHY | bg-background | Centered large serif quote + brand name, botanical illustration top-right |
| 09 | HOW IT WORKS | bg-background | 4-step numbered row: 01 CHECK IN → 02 EXPLORE → 03 REFLECT → 04 GROW |
| 10 | SUPPORT | bg-background | Left journal photo, right headline + body + CTA link |
| 11 | BEGIN | bg-muted (footer bar) | Footer text block + social icons |

---

## 4. Step 1 — Global CSS & Layout Setup

Before touching any section component, verify `globals.css` has:

```css
--background: 60 9% 96.7%;
--foreground: 0 0% 6.7%;
--muted-foreground: 60 2% 41.2%;
--border: 60 7% 88.8%;
```

Confirm `layout.tsx` loads:
- `Instrument_Serif` from `next/font/google` (weight: 400)
- `Inter` from `next/font/google` (weights: 400 500 600 700)
- Both mapped to CSS variables: `--font-serif` and `--font-sans`

`tailwind.config.ts` must extend:
```ts
fontFamily: {
  serif: ['var(--font-serif)', 'serif'],
  sans:  ['var(--font-sans)', 'sans-serif'],
}
```

---

## 5. Component Architecture

All components live inside `src/features/landing/ui/`. Each section is its own file. The page `src/app/page.tsx` orchestrates them with Lenis and GSAP only — zero business logic.

### File Map

```
src/
  app/
    page.tsx                        ← Lenis + GSAP orchestrator only
  features/
    landing/
      constants/
        copy.ts                     ← ALL copy strings
        images.ts                   ← ALL image src paths/alt strings
      types/
        landing.types.ts            ← Section prop types
      ui/
        Navbar.tsx                  ← NEW — was missing
        HeroSection.tsx             ← Section 01 — REBUILD
        FeelingSection.tsx          ← Section 02 — REPLACE PhilosophySection (old)
        OurSpaceSection.tsx         ← Section 03 — NEW
        TalkSection.tsx             ← Section 04 — REPLACE ChatPreviewSection
        ReflectSection.tsx          ← Section 05 — NEW
        ResetSection.tsx            ← Section 06 — REPLACE BreathingSection
        DiscoverSection.tsx         ← Section 07 — REPLACE GamesSection
        PhilosophySection.tsx       ← Section 08 — REBUILD (keep filename)
        HowItWorksSection.tsx       ← Section 09 — NEW
        SupportSection.tsx          ← Section 10 — NEW
        FooterSection.tsx           ← Section 11 — REPLACE CtaSection
      index.ts
```

**Legacy purge**: Delete `BentoSection.tsx`, `BreathingSection.tsx`, `GamesSection.tsx`, `CtaSection.tsx` after replacement is confirmed.

---

## 6. Copy Constants (`constants/copy.ts`)

```ts
export const LANDING_COPY = {
  nav: {
    wordmark: 'MINDBLOOM',
    links: ['EXPLORE', 'ABOUT', 'RESOURCES', 'SIGN IN'],
  },
  s01: {
    number: '01',
    label: 'INTRO',
    headline: "You don't have to\nhave it all figured out.",
    body: 'A quiet digital space for students to pause,\nreflect, find support, and take the next small step.',
    cta: 'ENTER MINDBLOOM',
    scrollHint: 'SCROLL',
  },
  s02: {
    number: '02',
    label: 'THE FEELING',
    headline: 'Some days,\neverything feels\nlike too much.',
    pills: ['DEADLINES', 'EXPECTATIONS', 'LONELINESS', 'UNCERTAINTY', 'PRESSURE'],
  },
  s03: {
    number: '03',
    label: 'OUR SPACE',
    headline: 'So we made a place\nto put some of it down.',
    body: "MindBloom is more than an app.\nIt's a space that understands,\nsupports, and grows with you.",
  },
  s04: {
    number: '04',
    label: 'TALK',
    headline: "Sometimes you\ndon't need an answer.\nYou just need\nsomewhere to talk.",
    body: 'Bloom is your AI companion\nwho listens, understands,\nand is here for you always.',
    chatName: 'Bloom',
    chatMessages: [
      { text: 'Hey, how are you feeling today?', sender: 'bloom' },
      { text: 'A little overwhelmed, honestly.', sender: 'user' },
      { text: "That's completely okay.\nWant to talk about it?", sender: 'bloom' },
    ],
    chatPlaceholder: 'Message Bloom...',
  },
  s05: {
    number: '05',
    label: 'REFLECT',
    headline: 'Give your thoughts\nsomewhere to grow.',
    body: 'Your journal becomes a tree.\nEvery thought, a leaf.\nEvery leaf, a part of your growth.',
    cta: 'EXPLORE JOURNAL',
  },
  s06: {
    number: '06',
    label: 'RESET',
    headline: 'Not everything\nneeds to be solved.',
    tagline: 'Take a breath. Play. Reset.',
    tools: ['BREATHE', 'FOCUS', 'UNWIND'],
  },
  s07: {
    number: '07',
    label: 'DISCOVER',
    headline: 'Find what helps,\nwhen you need it.',
    cta: 'EXPLORE RESOURCES',
    moods: ['Overwhelmed', 'Anxious', 'Lonely', 'Unmotivated', 'Tired'],
  },
  s08: {
    number: '08',
    label: 'PHILOSOPHY',
    quote: 'You are not something\nthat needs fixing.',
    brand: 'MINDBLOOM',
  },
  s09: {
    number: '09',
    label: 'HOW IT WORKS',
    steps: [
      { num: '01', title: 'CHECK IN',  body: 'Start where you are.' },
      { num: '02', title: 'EXPLORE',   body: 'Find what you need.' },
      { num: '03', title: 'REFLECT',   body: 'Understand yourself\na little better.' },
      { num: '04', title: 'GROW',      body: 'Take the next small\nstep forward.' },
    ],
  },
  s10: {
    number: '10',
    label: 'SUPPORT',
    headline: 'Support should be accessible.\nAnd when you need more,\nhelp should be close.',
    body: "MindBloom is here for you, but it's okay to reach out\nto a real person too. You don't have to go through it alone.",
    cta: 'SUPPORT RESOURCES',
  },
  s11: {
    number: '11',
    label: 'BEGIN',
  },
} as const;
```

---

## 7. Per-Section Layout Specs

### Navbar
- Full-width sticky bar, `border-b border-border bg-background/80 backdrop-blur-sm z-50`.
- Left: `MINDBLOOM` in `font-sans font-semibold text-sm tracking-[0.2em]`.
- Center: nav links in `font-sans font-medium text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors`.
- Right: Lucide `Menu` icon.
- `data-animate="navbar"`.

### Section 01 — INTRO
Layout: 3-zone horizontal row.
- Left gutter (narrow ~8%): section number `01` + label `INTRO` stacked, `font-sans text-[10px] tracking-widest uppercase text-muted-foreground`. Vertical line `|` between them.
- Center-wide (~80%): serif headline, body text, CTA arrow link.
  - Headline: `font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[1.02] whitespace-pre-line`.
  - Body: `font-sans text-sm text-muted-foreground leading-relaxed mt-4`.
  - CTA: `font-sans font-semibold text-[11px] tracking-[0.15em] uppercase border-b border-foreground pb-0.5 inline-flex items-center gap-2 mt-6`.
- Right gutter (~8%): `SCROLL` text rotated -90deg with a short vertical rule.
- `data-animate="hero-headline"` on headline, `data-animate="hero-body"` on body, `data-animate="hero-cta"` on CTA.

### Section 02 — THE FEELING
Layout: 2 columns, `border-t border-border`.
- Left 45%: section number/label, `font-serif text-4xl leading-tight` headline, then stacked pills.
  - Pill row: `font-sans font-medium text-[10px] tracking-[0.15em] uppercase border-b border-border py-2 w-full`.
- Right 55%: `relative h-[480px]` with `next/image fill object-cover`.
- `data-animate="feeling-headline"`, `data-animate="feeling-pill"` (stagger).

### Section 03 — OUR SPACE
Layout: 2 columns, `border-t border-border`.
- Left 60%: section number/label, `font-serif text-4xl` headline, `font-sans text-sm text-muted-foreground` body.
- Right 40%: botanical SVG illustration centered. Use `/images/landing/botanical.svg` or a simple dandelion SVG inline.
- `data-animate="space-headline"`, `data-animate="space-botanical"`.

### Section 04 — TALK (dark)
Layout: full-width dark section, `bg-foreground text-background relative overflow-hidden`.
- Background photo at `opacity-20 absolute inset-0 object-cover`.
- Content row: left 50% text, right 45% chat card.
- Left: section number (muted), `font-serif text-4xl text-background` headline, `font-sans text-sm text-background/70` body.
- Right: white chat card `bg-white text-foreground rounded-xl p-5 shadow-2xl`.
  - Header: `Bloom` avatar circle + name `font-sans font-semibold text-sm`.
  - Messages: `bloom` messages left-aligned, `user` messages right-aligned with light gray bg.
  - Input: `border-t border-border/30 pt-3 flex items-center gap-2`.
- `data-animate="talk-headline"`, `data-animate="chat-card"`, `data-animate="chat-msg"` on each message.

### Section 05 — REFLECT
Layout: 3 columns, `border-t border-border`.
- Left 42%: section number, `font-serif text-4xl` headline, body, `EXPLORE JOURNAL →` link.
- Center 16%: botanical tree illustration, vertically centered. `relative h-full flex items-center justify-center`.
- Right 42%: `relative h-[420px]` `next/image fill object-cover` of open journal.
- `data-animate="reflect-headline"`, `data-animate="reflect-botanical"`, `data-animate="reflect-photo"`.

### Section 06 — RESET (dark)
Layout: 2 columns, `bg-foreground text-background border-t border-border/20`.
- Left 50%: section number (muted), `font-serif text-5xl text-background` headline, `font-sans text-xs text-background/60` tagline.
- Right 50%: `flex flex-row gap-6 items-center justify-center`.
  - Each circle tool: `w-32 h-32 rounded-full border border-background/30 flex flex-col items-center justify-center gap-2`.
  - Icon: small SVG/Lucide icon ~20px.
  - Label: `font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-background`.
- `data-animate="reset-headline"`, `data-animate="reset-circle"` (stagger).

### Section 07 — DISCOVER
Layout: 2 columns, `border-t border-border`.
- Left 30%: section number, `font-serif text-4xl` headline, `EXPLORE RESOURCES →` link.
- Right 70%: `flex flex-row gap-3` of 5 mood cards.
  - Each card: `relative flex-1 h-[280px] rounded-sm overflow-hidden`.
  - Mood label overlay: `absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent py-3 text-center font-sans text-xs font-medium text-white`.
- `data-animate="discover-headline"`, `data-animate="discover-card"` (stagger).

### Section 08 — PHILOSOPHY
Layout: centered, `border-t border-border`.
- Position `botanical-accent` illustration: `absolute top-4 right-8 w-24 opacity-70`.
- Center: `font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-center leading-tight whitespace-pre-line` quote.
- Below: `font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground text-center mt-3`.
- `data-animate="philosophy-quote"`, `data-animate="philosophy-brand"`.

### Section 09 — HOW IT WORKS
Layout: `border-t border-b border-border`.
- `flex flex-row items-start gap-0` with 4 step columns + 3 arrow separators.
- Each step: `flex-1 py-8 px-6`.
  - Number: `font-serif text-7xl text-foreground leading-none`.
  - Arrow separator: `font-sans text-2xl text-muted-foreground self-center`.
  - Title: `font-sans font-semibold text-[10px] tracking-[0.2em] uppercase mt-3`.
  - Body: `font-sans text-xs text-muted-foreground mt-1 whitespace-pre-line`.
- `data-animate="step"` on each step (stagger).

### Section 10 — SUPPORT
Layout: 2 columns, `border-t border-border`.
- Left 45%: `relative h-[480px]` `next/image fill object-cover` (staircase photo).
- Right 55%: section number, `font-serif text-[2.5rem] leading-[1.15]` headline (3 lines), `font-sans text-sm text-muted-foreground` body, `SUPPORT RESOURCES →` link.
- `data-animate="support-headline"`, `data-animate="support-photo"`.

### Section 11 — BEGIN (Footer)
Layout: narrow bar, `bg-secondary border-t border-border`.
- Left: section number + label stack, small `font-sans text-xs text-muted-foreground` body copy.
- Right: row of social icon links (`font-sans text-muted-foreground hover:text-foreground`).
- `data-animate="footer"`.

---

## 8. Animation Hooks Reference

All animatable elements carry `data-animate="[name]"`. GSAP queries by attribute.

Initial states set in `page.tsx`:
```ts
gsap.set('[data-animate="hero-headline"]', { y: 80, opacity: 0 });
gsap.set('[data-animate="hero-body"]',     { y: 40, opacity: 0 });
gsap.set('[data-animate="hero-cta"]',      { y: 20, opacity: 0 });
gsap.set('[data-animate="navbar"]',        { y: -20, opacity: 0 });
// ... etc for every data-animate value
```

ScrollTrigger animations (staggered for array elements):
```ts
gsap.to('[data-animate="feeling-pill"]', {
  scrollTrigger: { trigger: '#section-02', start: 'top 75%' },
  opacity: 1, y: 0,
  stagger: 0.1, duration: 0.6, ease: 'power2.out',
});
```

---

## 9. Image Asset Strategy

Images go in `public/images/landing/`. All declared in `constants/images.ts`:

```ts
export const LANDING_IMAGES = {
  feeling:              { src: '/images/landing/feeling.jpg',              alt: 'Student sitting alone by a window' },
  talkBg:              { src: '/images/landing/talk-bg.jpg',              alt: 'Dark ambient background texture' },
  reflectJournal:      { src: '/images/landing/reflect-journal.jpg',      alt: 'Open journal on a desk' },
  discoverOverwhelmed: { src: '/images/landing/discover-overwhelmed.jpg', alt: 'Ocean waves — feeling overwhelmed' },
  discoverAnxious:     { src: '/images/landing/discover-anxious.jpg',     alt: 'Soft light — feeling anxious' },
  discoverLonely:      { src: '/images/landing/discover-lonely.jpg',      alt: 'Lone figure in a landscape — feeling lonely' },
  discoverUnmotivated: { src: '/images/landing/discover-unmotivated.jpg', alt: 'Flower in still light — unmotivated' },
  discoverTired:       { src: '/images/landing/discover-tired.jpg',       alt: 'Warm shadows on floor — feeling tired' },
  supportStairs:       { src: '/images/landing/support-stairs.jpg',       alt: 'Calm architectural staircase' },
} as const;
```

If images are not available, use `placeholder="blur"` with a muted solid color placeholder or a gray div until assets are provided.

---

## 10. Types (`types/landing.types.ts`)

```ts
export type ChatMessage = {
  readonly text: string;
  readonly sender: 'bloom' | 'user';
};

export type HowItWorksStep = {
  readonly num: string;
  readonly title: string;
  readonly body: string;
};

export type MoodCard = {
  readonly label: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};

export type ResetTool = {
  readonly label: string;
  readonly iconName: string;
};
```

No `any`. No implicit `any`. TypeScript strict mode.

---

## 11. Build Plan (Sequential Steps)

Execute in order. Do not skip ahead.

1. **Global CSS & Font Verification** — confirm tokens, fonts, Tailwind config.
2. **Constants & Types** — create `copy.ts`, `images.ts`, `landing.types.ts`.
3. **Navbar** — sticky, blurred, all links from constants.
4. **Section 01: HeroSection** — rebuild from scratch.
5. **Section 02: FeelingSection** — two-column with pills and photo.
6. **Section 03: OurSpaceSection** — two-column with botanical.
7. **Section 04: TalkSection** — dark section with chat card.
8. **Section 05: ReflectSection** — three-column with botanical + journal photo.
9. **Section 06: ResetSection** — dark section with 3 circular tools.
10. **Section 07: DiscoverSection** — mood cards row.
11. **Section 08: PhilosophySection** — centered quote.
12. **Section 09: HowItWorksSection** — 4-step row with arrows.
13. **Section 10: SupportSection** — two-column with staircase photo.
14. **Section 11: FooterSection** — narrow footer bar.
15. **page.tsx Orchestration** — update imports, wire GSAP + Lenis.
16. **Legacy Purge** — delete old files, verify no dead imports, run `next build`.

---

## 12. Definition of Done

- Visual output matches `image.png` section for section.
- All copy pulled from `LANDING_COPY` — no inline strings in JSX.
- All images use `next/image` with `LANDING_IMAGES` constants.
- Types in `landing.types.ts`.
- Zero hardcoded colors, fonts, or spacing.
- Legacy files deleted.
- `next build` passes.
- `progress.md` updated.

---

*Spec written by /istm-craft. Run `/istm-develop` to begin implementation.*
