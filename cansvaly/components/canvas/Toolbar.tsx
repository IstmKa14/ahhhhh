'use client';

import React from 'react';
import {
  MousePointer,
  Hand,
  Pencil,
  Eraser,
  Square,
  Circle,
  ArrowUpRight,
  Type,
  StickyNote,
  MessageSquare,
} from 'lucide-react';
import { useToolbarStore, CanvasTool } from '@/stores/toolbarStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ToolItem {
  id: CanvasTool;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const TOOLS: ToolItem[] = [
  { id: 'select', label: 'Select', icon: MousePointer, shortcut: 'V' },
  { id: 'hand', label: 'Hand', icon: Hand, shortcut: 'H' },
  { id: 'draw', label: 'Draw', icon: Pencil, shortcut: 'P' },
  { id: 'eraser', label: 'Eraser', icon: Eraser, shortcut: 'E' },
  { id: 'rectangle', label: 'Rectangle', icon: Square, shortcut: 'R' },
  { id: 'ellipse', label: 'Ellipse', icon: Circle, shortcut: 'O' },
  { id: 'arrow', label: 'Arrow', icon: ArrowUpRight, shortcut: 'A' },
  { id: 'text', label: 'Text', icon: Type, shortcut: 'T' },
  { id: 'note', label: 'Sticky Note', icon: StickyNote, shortcut: 'N' },
  { id: 'comment', label: 'Comment', icon: MessageSquare, shortcut: 'C' },
];

export function Toolbar() {
  const { activeTool, setActiveTool, isCommentsPanelOpen } = useToolbarStore();

  return (
    <TooltipProvider>
      <aside className="absolute left-4 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-1 rounded-xl border border-border bg-card p-1.5 shadow-md">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id || (tool.id === 'comment' && isCommentsPanelOpen);

          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger
                render={
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="icon"
                    className={cn(
                      'h-10 w-10 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                }
              />
              <TooltipContent side="right" className="flex items-center gap-2">
                <span>{tool.label}</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                  {tool.shortcut}
                </kbd>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}
