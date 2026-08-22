'use client';

import * as React from 'react';
import { Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewBoardButton } from './NewBoardButton';
import { CustomUserButton } from './CustomUserButton';

interface DashboardHeaderProps {
  onNewBoard?: () => void;
}

export function DashboardHeader({ onNewBoard }: DashboardHeaderProps) {
  return (
    <header className="flex h-[56px] items-center justify-between px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search boards... (⌘K)"
            className="pl-9 h-9 text-sm bg-background border-input"
          />
        </div>
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
