'use client';

// GardenErrorBoundary: catches WebGL or Three.js init failures.
// Renders a warm fallback instead of a broken page.
// This is the foundation for the full Phase 10 accessibility fallback.

import React from 'react';
import Link from 'next/link';

interface State {
  hasError: boolean;
}

export class GardenErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Error is caught silently. Phase 10 adds telemetry.
    console.warn('[Garden] Canvas error:', error.message, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-background px-6 text-center">
          <p className="font-headline text-3xl text-foreground">
            The Garden needs a moment.
          </p>
          <p className="font-body text-base text-muted-foreground max-w-sm">
            Your browser or device cannot display the 3D Garden right now.
            You can still talk to Bloom, write in your journal, and explore resources.
          </p>
          <Link
            href="/dashboard"
            className="font-body text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Go to dashboard
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
