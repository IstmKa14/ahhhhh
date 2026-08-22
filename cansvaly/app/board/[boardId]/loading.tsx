import React from 'react';
import { Loader2 } from 'lucide-react';

export default function BoardLoading() {
  return (
    <div className="fixed inset-0 h-full w-full bg-background overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
          <div className="h-6 w-6 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-px bg-border mx-1" />
          <div className="h-6 w-36 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </div>
          <div className="h-9 w-20 rounded-lg bg-muted animate-pulse" />
          <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        </div>
      </header>

      <aside className="absolute left-4 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-md">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
        ))}
      </aside>

      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Canvasly workspace...</p>
        </div>
      </div>
    </div>
  );
}
