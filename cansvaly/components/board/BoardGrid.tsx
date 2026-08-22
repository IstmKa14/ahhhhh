'use client';

import * as React from 'react';
import { LayoutGrid, Star, Users, Plus } from 'lucide-react';
import { BoardCard, BoardCardProps } from './BoardCard';
import { BoardCardSkeleton } from './BoardCardSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

interface BoardGridProps {
  boards?: BoardCardProps[];
  isLoading?: boolean;
  filter?: 'all' | 'favorites' | 'shared';
  onNewBoard?: () => void;
}

export function BoardGrid({ boards = [], isLoading = false, filter = 'all', onNewBoard }: BoardGridProps) {
  const filteredBoards = React.useMemo(() => {
    if (filter === 'favorites') return boards.filter((b) => b.isFavorited);
    if (filter === 'shared') return boards.filter((b) => b.ownerName !== 'You');
    return boards;
  }, [boards, filter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredBoards.length === 0) {
    if (filter === 'favorites') {
      return (
        <EmptyState
          icon={Star}
          title="No favorite boards yet"
          description="Star any board to quickly access it here from your favorites list."
        />
      );
    }

    if (filter === 'shared') {
      return (
        <EmptyState
          icon={Users}
          title="No shared boards"
          description="Boards shared with you by teammates will appear here."
        />
      );
    }

    return (
      <EmptyState
        icon={LayoutGrid}
        title="Create your first board"
        description="Get started by creating a new collaborative whiteboard for your team."
        action={onNewBoard ? { label: 'New Board', onClick: onNewBoard } : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredBoards.map((board) => (
        <BoardCard key={board.id} {...board} />
      ))}
    </div>
  );
}
