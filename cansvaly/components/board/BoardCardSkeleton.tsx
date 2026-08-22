import * as React from 'react';
import { Card } from '@/components/ui/card';

export function BoardCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-pulse">
      <div className="aspect-video w-full bg-muted" />
      <div className="flex items-center justify-between p-3.5 gap-2">
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted/60 rounded" />
        </div>
        <div className="h-6 w-6 rounded-full bg-muted" />
      </div>
    </Card>
  );
}
