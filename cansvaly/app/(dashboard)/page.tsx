'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { BoardGrid } from '@/components/board/BoardGrid';
import { BoardCardProps } from '@/components/board/BoardCard';

const MOCK_BOARDS: BoardCardProps[] = [
  {
    id: 'b1',
    title: 'Product Roadmap 2026',
    description: 'Q3 & Q4 planning canvas with feature dependencies',
    isFavorited: true,
    updatedAt: '2 hours ago',
    ownerName: 'You',
  },
  {
    id: 'b2',
    title: 'System Architecture Diagram',
    description: 'Real-time sync engine & database layout',
    isFavorited: false,
    updatedAt: 'Yesterday',
    ownerName: 'Alex Chen',
  },
  {
    id: 'b3',
    title: 'Design System & Token Spec',
    description: 'Typography, semantic palette & component guidelines',
    isFavorited: true,
    updatedAt: '3 days ago',
    ownerName: 'You',
  },
  {
    id: 'b4',
    title: 'Customer Feedback & Ideas',
    description: 'Sticky notes from quarterly user interviews',
    isFavorited: false,
    updatedAt: '1 week ago',
    ownerName: 'Sarah Jenkins',
  },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const filter = filterParam === 'favorites' ? 'favorites' : filterParam === 'shared' ? 'shared' : 'all';

  const [boards, setBoards] = React.useState<BoardCardProps[]>(MOCK_BOARDS);

  const handleNewBoard = () => {
    const newBoard: BoardCardProps = {
      id: `b${Date.now()}`,
      title: 'Untitled Board',
      isFavorited: false,
      updatedAt: 'Just now',
      ownerName: 'You',
    };
    setBoards((prev) => [newBoard, ...prev]);
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

      <BoardGrid boards={boards} filter={filter} onNewBoard={handleNewBoard} />
    </div>
  );
}
