'use client';

import React from 'react';
import { ClientSideSuspense } from '@liveblocks/react';
import { RoomProvider } from '@/lib/liveblocks';
import { CanvasInner } from '@/components/canvas/CanvasInner';
import BoardLoading from '@/app/board/[boardId]/loading';

interface CanvasProps {
  boardId: string;
  boardTitle: string;
}

export function Canvas({ boardId, boardTitle }: CanvasProps) {
  const roomId = `board-${boardId}`;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selectedShapeIds: [],
        user: {
          id: '',
          name: '',
          avatarUrl: '',
          color: '#5b4eff',
        },
      }}
    >
      <ClientSideSuspense fallback={<BoardLoading />}>
        {() => <CanvasInner boardId={boardId} boardTitle={boardTitle} />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
