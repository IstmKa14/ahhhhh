"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground lg:flex-row">
      {/* Left side: Brand Showcase Panel (Desktop) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border bg-muted/40 p-12 lg:flex">
        {/* Background Subtle Gradient & Grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <svg
          className="absolute inset-0 size-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="auth-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-muted-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>

        {/* Top Header */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Middle Feature Showcase */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap size={14} />
            <span>Real-time Whiteboard Suite</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome back to your workspace.
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            Pick up right where your team left off. Instant sync, live collaboration, and infinite canvas space for all your ideas.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 size={18} className="text-primary shrink-0" />
              <span>Multi-user presence with live cursors</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 size={18} className="text-primary shrink-0" />
              <span>Export high quality vector assets & diagrams</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 size={18} className="text-primary shrink-0" />
              <span>End-to-end reliable room state synchronization</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={16} className="text-primary" />
          <span>Enterprise-grade security and authentication</span>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:w-1/2">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Button variant="ghost" size="sm" render={<Link href="/" />}>
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Button>
        </div>

        {/* Main Sign In Form Card */}
        <div className="mx-auto w-full max-w-md space-y-6 py-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Sign in to Canvasly
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your details below to access your account
            </p>
          </div>

          {/* Social Sign-in Button */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full h-10 gap-2 font-medium">
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="relative bg-background px-3 text-xs uppercase text-muted-foreground">
              Or continue with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@work-email.com"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <Button type="submit" className="w-full h-10 font-medium">
              Sign In
            </Button>
          </form>

          {/* Footer toggle link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Bottom copyright/terms */}
        <div className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
