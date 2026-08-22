import { Button } from "@/components/ui/button";
import { PRESENCE_COLORS } from "@/lib/presence-colors";
import { DarkModeToggle } from "./dark-mode-toggle";

export const metadata = {
  title: "Design System — Canvasly",
};

// ─── Sections ──────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({
  label,
  bg,
  text,
  hex,
}: {
  label: string;
  bg: string;
  text: string;
  hex: string;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div
        className={`h-14 w-full rounded-lg border border-border ${bg}`}
        title={hex}
      />
      <p className={`text-xs font-medium truncate ${text}`}>{label}</p>
      <p className="text-xs text-muted-foreground font-mono">{hex}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <>
      {/* Sticky top bar with dark mode toggle */}
      <div className="sticky top-0 z-10 flex justify-end px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
        <DarkModeToggle />
      </div>

    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
          <span className="size-1.5 rounded-full bg-primary inline-block" />
          Design System
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Canvasly Tokens
        </h1>
        <p className="text-muted-foreground text-base max-w-prose">
          The single source of truth for every color, type scale, radius, and
          component variant used across Canvasly.
        </p>
      </div>

      {/* ── Colors: Light mode surfaces ── */}
      <Section title="Surface Colors">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Swatch label="background" bg="bg-background" text="text-foreground" hex="#ffffff" />
          <Swatch label="card" bg="bg-card" text="text-card-foreground" hex="#ffffff" />
          <Swatch label="muted" bg="bg-muted" text="text-muted-foreground" hex="#f4f4f6" />
          <Swatch label="secondary" bg="bg-secondary" text="text-secondary-foreground" hex="#f0f0f5" />
        </div>
      </Section>

      {/* ── Colors: Brand ── */}
      <Section title="Brand — Indigo-Violet">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Swatch label="primary" bg="bg-primary" text="text-primary-foreground" hex="#5b4eff" />
          <Swatch label="primary/80" bg="bg-primary/80" text="text-primary-foreground" hex="#5b4eff @ 80%" />
          <Swatch label="primary/20" bg="bg-primary/20" text="text-primary" hex="#5b4eff @ 20%" />
          <Swatch label="ring" bg="bg-ring" text="text-primary-foreground" hex="#5b4eff" />
        </div>
      </Section>

      {/* ── Colors: Semantic ── */}
      <Section title="Semantic Colors">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Swatch label="destructive" bg="bg-destructive" text="text-destructive-foreground" hex="#ef4444" />
          <Swatch label="destructive/10" bg="bg-destructive/10" text="text-destructive" hex="#ef4444 @ 10%" />
          <Swatch label="accent" bg="bg-accent" text="text-accent-foreground" hex="#f0f0f5" />
          <Swatch label="border" bg="bg-border" text="text-foreground" hex="#e4e4ea" />
        </div>
      </Section>

      {/* ── Collaboration presence colors ── */}
      <Section title="Collaboration Presence Colors">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PRESENCE_COLORS.map((hex) => (
            <div key={hex} className="flex flex-col items-center gap-1">
              <div
                className="size-10 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: hex }}
              />
              <p className="text-xs font-mono text-muted-foreground">{hex}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Typography ── */}
      <Section title="Type Scale">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <p className="text-5xl font-bold tracking-tight">Display / H1</p>
          <p className="text-3xl font-semibold tracking-tight">Section / H2</p>
          <p className="text-xl font-semibold">Card / H3</p>
          <p className="text-base leading-7">
            Body large — Canvasly is a real-time collaborative whiteboard for
            professional teams. Draw, design, and ideate together instantly.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Body small / muted — Used for descriptions, secondary metadata,
            captions, and helper text throughout the UI.
          </p>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Caption / Label
          </p>
          <p className="font-mono text-sm text-foreground">
            {`const board = await db.select().from(boards).where(eq(boards.id, id))`}
          </p>
        </div>
      </Section>

      {/* ── Border Radius ── */}
      <Section title="Border Radius">
        <div className="flex flex-wrap gap-6 items-end">
          {[
            { label: "rounded (sm)", cls: "rounded", size: "h-10 w-10" },
            { label: "rounded-md", cls: "rounded-md", size: "h-12 w-12" },
            { label: "rounded-lg", cls: "rounded-lg", size: "h-14 w-14" },
            { label: "rounded-xl", cls: "rounded-xl", size: "h-16 w-16" },
            { label: "rounded-full", cls: "rounded-full", size: "h-16 w-16" },
          ].map(({ label, cls, size }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`${size} ${cls} bg-primary/20 border-2 border-primary`} />
              <p className="text-xs text-muted-foreground font-mono">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Shadows ── */}
      <Section title="Elevation / Shadows">
        <div className="flex flex-wrap gap-6">
          {[
            { label: "shadow-sm — cards", cls: "shadow-sm" },
            { label: "shadow-md — toolbar", cls: "shadow-md" },
            { label: "shadow-xl — modals", cls: "shadow-xl" },
            { label: "shadow-2xl — overlays", cls: "shadow-2xl" },
          ].map(({ label, cls }) => (
            <div
              key={label}
              className={`h-20 w-32 rounded-xl bg-card border border-border ${cls} flex items-center justify-center`}
            >
              <p className="text-xs text-muted-foreground text-center px-2">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Buttons ── */}
      <Section title="Button Variants">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="default" size="lg">Large</Button>
          <Button variant="default" size="default">Default</Button>
          <Button variant="default" size="sm">Small</Button>
          <Button variant="default" size="xs">XS</Button>
          <Button variant="default" disabled>Disabled</Button>
        </div>
      </Section>

      {/* ── Motion tokens ── */}
      <Section title="Motion Tokens">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          {[
            { label: "duration-fast — 150ms", desc: "Hover states, tooltip reveals" },
            { label: "duration-base — 200ms", desc: "Button state changes, focus rings" },
            { label: "duration-slow — 300ms", desc: "Modal open/close, panel slide-in" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-start gap-4 min-w-0">
              <code className="text-xs font-mono bg-muted text-primary px-2 py-1 rounded shrink-0">
                {label}
              </code>
              <p className="text-sm text-muted-foreground min-w-0">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Spacing ── */}
      <Section title="Spacing Scale (8px grid)">
        <div className="flex flex-wrap gap-3 items-end">
          {[
            { label: "p-1 / 4px", size: "size-1" },
            { label: "p-2 / 8px", size: "size-2" },
            { label: "p-4 / 16px", size: "size-4" },
            { label: "p-6 / 24px", size: "size-6" },
            { label: "p-8 / 32px", size: "size-8" },
            { label: "p-12 / 48px", size: "size-12" },
            { label: "p-16 / 64px", size: "size-16" },
          ].map(({ label, size }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`${size} bg-primary/30 rounded`} />
              <p className="text-xs font-mono text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
    </>
  );
}
