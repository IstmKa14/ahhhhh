'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { BoardGrid } from '@/components/board/BoardGrid';
import { BoardCardProps } from '@/components/board/BoardCard';
import { getBoardsAction, duplicateBoardAction } from '@/app/(dashboard)/actions';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const filter = filterParam === 'favorites' ? 'favorites' : filterParam === 'shared' ? 'shared' : 'all';

  const [boards, setBoards] = React.useState<BoardCardProps[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const loadBoards = React.useCallback(async () => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const dbBoards = await getBoardsAction(filter);
      const mapped: BoardCardProps[] = dbBoards.map((b) => ({
        id: b.id,
        title: b.title,
        thumbnailUrl: b.imageUrl,
        isFavorited: false,
        updatedAt: new Date(b.updatedAt).toLocaleDateString(),
        ownerName: b.authorName || 'You',
      }));
      setBoards(mapped);
    } catch (err) {
      console.error('Failed to load boards from Neon DB:', err);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [filter, isInitialLoad]);

  React.useEffect(() => {
    loadBoards();

    // 3-second light polling interval to automatically keep board lists synced
    const interval = setInterval(() => {
      loadBoards();
    }, 3000);

    // Refetch when tab regains focus
    const onFocus = () => loadBoards();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [loadBoards]);

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateBoardAction(id);
      await loadBoards();
    } catch (err) {
      console.error('Failed to duplicate board:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {filter === 'favorites' ? 'Favorite Boards' : filter === 'shared' ? 'Shared with Me' : 'All Boards'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === 'favorites'
              ? 'Quick access to your starred collaborative whiteboards'
              : filter === 'shared'
              ? 'Boards shared with you across workspaces'
              : 'Collaborative whiteboards in your personal workspace'}
          </p>
        </div>
      </div>

      <BoardGrid
        boards={boards.map((b) => ({
          ...b,
          onDuplicate: handleDuplicate,
        }))}
        isLoading={isLoading}
        filter={filter}
      />
    </div>
  );
}
