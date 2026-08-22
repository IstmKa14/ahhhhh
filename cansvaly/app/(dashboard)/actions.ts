'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { boards, boardMembers, users } from '@/db/schema';
import { eq, and, ilike, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createBoardSchema, renameBoardSchema, inviteCollaboratorSchema } from '@/lib/validations';
import { z } from 'zod';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
];

function getDb() {
  if (!db) {
    throw new Error('Database connection not initialized. Please set DATABASE_URL in .env.local.');
  }
  return db;
}

async function ensureUserSynced() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const database = getDb();
  const existing = await database.select().from(users).where(eq(users.id, userId)).limit(1);
  if (existing.length > 0) return userId;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? '';
  const firstName = clerkUser?.firstName ?? '';
  const lastName = clerkUser?.lastName ?? '';
  const imageUrl = clerkUser?.imageUrl ?? '';

  await database.insert(users).values({
    id: userId,
    email,
    firstName,
    lastName,
    imageUrl,
  }).onConflictDoNothing();

  return userId;
}

export async function createBoardAction(input: z.infer<typeof createBoardSchema>) {
  const userId = await ensureUserSynced();
  const database = getDb();
  const clerkUser = await currentUser();
  const authorName = clerkUser ? `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'You' : 'You';

  const validated = createBoardSchema.parse(input);
  const randomImage = UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)];

  const [newBoard] = await database.insert(boards).values({
    title: validated.title,
    orgId: 'personal',
    authorId: userId,
    authorName,
    imageUrl: randomImage,
  }).returning();

  await database.insert(boardMembers).values({
    boardId: newBoard.id,
    userId,
    role: 'owner',
  });

  revalidatePath('/');
  return { success: true, boardId: newBoard.id };
}

export async function getBoardsAction(filter: string = 'all') {
  const { userId } = await auth();
  if (!userId || !db) return [];
  const database = getDb();

  if (filter === 'shared') {
    const sharedMemberships = await database
      .select({ boardId: boardMembers.boardId })
      .from(boardMembers)
      .where(and(eq(boardMembers.userId, userId), eq(boardMembers.role, 'editor')));

    if (sharedMemberships.length === 0) return [];
    
    const boardIds = sharedMemberships.map((m) => m.boardId);
    const result = await database.select().from(boards).orderBy(desc(boards.updatedAt));
    return result.filter((b) => boardIds.includes(b.id));
  }

  return await database
    .select()
    .from(boards)
    .where(eq(boards.authorId, userId))
    .orderBy(desc(boards.updatedAt));
}

export async function renameBoardAction(boardId: string, newTitle: string) {
  const userId = await ensureUserSynced();
  const database = getDb();
  const validated = renameBoardSchema.parse({ boardId, title: newTitle });

  await database
    .update(boards)
    .set({ title: validated.title, updatedAt: new Date() })
    .where(and(eq(boards.id, validated.boardId), eq(boards.authorId, userId)));

  revalidatePath('/');
  return { success: true };
}

export async function deleteBoardAction(boardId: string) {
  const userId = await ensureUserSynced();
  const database = getDb();

  await database
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.authorId, userId)));

  revalidatePath('/');
  return { success: true };
}

export async function searchBoardsAction(query: string) {
  const { userId } = await auth();
  if (!userId || !query.trim() || !db) return [];
  const database = getDb();

  return await database
    .select({
      id: boards.id,
      title: boards.title,
      imageUrl: boards.imageUrl,
      updatedAt: boards.updatedAt,
    })
    .from(boards)
    .where(
      and(
        eq(boards.authorId, userId),
        ilike(boards.title, `%${query}%`)
      )
    )
    .limit(10);
}

export async function inviteCollaboratorAction(input: z.infer<typeof inviteCollaboratorSchema>) {
  const userId = await ensureUserSynced();
  const database = getDb();
  const validated = inviteCollaboratorSchema.parse(input);

  const targetUsers = await database.select().from(users).where(eq(users.email, validated.email)).limit(1);
  if (targetUsers.length === 0) {
    return { success: false, error: 'User with this email is not registered' };
  }

  const targetUser = targetUsers[0];

  await database.insert(boardMembers).values({
    boardId: validated.boardId,
    userId: targetUser.id,
    role: validated.role,
  });

  revalidatePath('/');
  return { success: true };
}

export async function duplicateBoardAction(boardId: string) {
  const userId = await ensureUserSynced();
  const database = getDb();
  const clerkUser = await currentUser();
  const authorName = clerkUser ? `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'You' : 'You';

  const [existingBoard] = await database.select().from(boards).where(eq(boards.id, boardId)).limit(1);
  if (!existingBoard) throw new Error('Board not found');

  const duplicateTitle = `${existingBoard.title} copy(1)`;

  const [newBoard] = await database.insert(boards).values({
    title: duplicateTitle,
    orgId: existingBoard.orgId,
    authorId: userId,
    authorName,
    imageUrl: existingBoard.imageUrl,
  }).returning();

  await database.insert(boardMembers).values({
    boardId: newBoard.id,
    userId,
    role: 'owner',
  });

  revalidatePath('/');
  return { success: true, boardId: newBoard.id };
}
