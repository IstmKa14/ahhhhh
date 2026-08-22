'use client';

import * as React from 'react';
import { Search, Building2 } from 'lucide-react';
import { useModalStore } from '@/stores/modalStore';
import { NewBoardButton } from './NewBoardButton';
import { CustomUserButton } from './CustomUserButton';

interface DashboardHeaderProps {
  onNewBoard?: () => void;
}

export function DashboardHeader({ onNewBoard }: DashboardHeaderProps) {
  const { openSearch } = useModalStore();

  return (
    <header className="flex h-[56px] items-center justify-between px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={openSearch}
          className="relative flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search boards or run commands...</span>
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          <span>Personal Workspace</span>
        </div>

        <NewBoardButton onClick={onNewBoard} />
        <CustomUserButton />
      </div>
    </header>
  );
}
