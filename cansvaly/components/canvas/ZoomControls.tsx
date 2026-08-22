'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ZoomControlsProps {
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export function ZoomControls({
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ZoomControlsProps) {
  return (
    <TooltipProvider>
      <div className="absolute bottom-4 right-4 z-40 flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-md">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent side="top">Zoom Out</TooltipContent>
        </Tooltip>

        <span className="w-12 text-center text-xs font-medium text-foreground">
          {Math.round(zoom)}%
        </span>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent side="top">Zoom In</TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onResetZoom}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent side="top">Fit to View</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
