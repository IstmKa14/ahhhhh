import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Users, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

// ─── Feature data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Zap,
    title: "Instant real-time sync",
    description:
      "Every stroke, shape, and move is reflected to every collaborator in milliseconds — no refresh required.",
  },
  {
    icon: Layers,
    title: "Infinite canvas",
    description:
      "Pan and zoom freely. Your ideas never run out of space, and the canvas stays silky smooth no matter how much is on it.",
  },
  {
    icon: Users,
    title: "Team presence",
    description:
      "See exactly where your teammates are working. Live cursors, avatars, and selected-shape highlights keep everyone in context.",
  },
] as const;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo />

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Get started free
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button variant="outline" size="sm" render={<Link href="/dashboard" />}>
                Go to Dashboard
              </Button>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-24 pt-24 text-center">
          <span className="mb-5 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Real-time collaboration · Built for teams
          </span>

          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            The canvas where{" "}
            <span className="text-primary">great teams</span> think together
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Canvasly is a professional collaborative whiteboard. Draw, diagram, and design
            together in real time — no lag, no conflict, no limits.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/sign-up" />}>
              Start for free
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/sign-in" />}>
              Sign in to your workspace
            </Button>
          </div>
        </section>

        {/* ── Canvas preview strip ─────────────────────────────────────── */}
        <section className="w-full border-y border-border bg-muted/40 py-16">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-6">
            {/* Stylised canvas mockup */}
            <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {/* Topbar simulation */}
              <div className="flex h-11 items-center justify-between border-b border-border px-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-destructive/60" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Team Roadmap Q4
                </span>
                {/* Presence avatars */}
                <div className="flex -space-x-1.5">
                  {["#5b4eff", "#10b981", "#f59e0b", "#ef4444"].map((color, i) => (
                    <span
                      key={i}
                      className="flex size-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {["A", "B", "C", "D"][i]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Canvas area */}
              <div className="relative h-64 overflow-hidden bg-[#fafafa] dark:bg-[#111114]">
                {/* Grid dots */}
                <svg
                  className="absolute inset-0 size-full opacity-30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="currentColor" className="text-muted-foreground" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>

                {/* Placeholder shapes */}
                <div className="absolute left-10 top-8 h-16 w-28 rounded-lg border-2 border-primary/60 bg-primary/10" />
                <div className="absolute left-52 top-14 h-12 w-36 rounded border-2 border-emerald-500/60 bg-emerald-500/10" />
                <div className="absolute left-[420px] top-6 h-20 w-20 rounded-full border-2 border-amber-500/60 bg-amber-500/10" />
                <div className="absolute bottom-8 left-32 h-10 w-48 rounded border-2 border-rose-500/40 bg-rose-500/10" />

                {/* Cursor simulation */}
                <div className="absolute left-[340px] top-[90px] flex flex-col items-start gap-1">
                  <svg width="14" height="18" viewBox="0 0 14 18" className="drop-shadow">
                    <path d="M0 0L0 14L4 10L7 17L9 16L6 9H11L0 0Z" fill="#5b4eff" />
                  </svg>
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-white shadow">
                    Alex
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for the way teams actually work
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
              Fast tools that get out of the way so you can focus on ideas, not software.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ──────────────────────────────────────────────── */}
        <section className="w-full border-t border-border bg-primary/5 py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ready to start collaborating?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
              Create your first board in seconds. No credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/sign-up" />}>
                Create free account
              </Button>
              <Button variant="outline" size="lg" render={<Link href="/sign-in" />}>
                Sign in
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Canvasly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
