import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { boards, boardMembers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Canvas } from '@/components/canvas/Canvas';

interface BoardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  if (!db) {
    notFound();
  }

  const boardResult = await db
    .select()
    .from(boards)
    .where(eq(boards.id, boardId))
    .limit(1);

  if (boardResult.length === 0) {
    notFound();
  }

  const memberResult = await db
    .select()
    .from(boardMembers)
    .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId)))
    .limit(1);

  if (memberResult.length === 0) {
    redirect('/dashboard');
  }

  const board = boardResult[0];

  return (
    <div className="fixed inset-0 h-full w-full bg-background overflow-hidden">
      <Canvas boardId={board.id} boardTitle={board.title} />
    </div>
  );
}
