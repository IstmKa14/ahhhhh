import { Liveblocks } from '@liveblocks/node';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { boardMembers, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getPresenceColor } from '@/lib/presence-colors';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || 'sk_dev_dummy_key_for_build',
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!db) {
    return new Response('Database not initialized', { status: 500 });
  }

  let room = '';
  try {
    const json = await request.json();
    room = json.room;
  } catch {
    return new Response('Invalid payload', { status: 400 });
  }

  if (!room || typeof room !== 'string' || !room.startsWith('board-')) {
    return new Response('Invalid room ID', { status: 400 });
  }

  const boardId = room.replace('board-', '');

  const member = await db
    .select()
    .from(boardMembers)
    .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId)))
    .limit(1);

  if (member.length === 0) {
    return new Response('Forbidden', { status: 403 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const fullName = user[0] ? [user[0].firstName, user[0].lastName].filter(Boolean).join(' ') : '';

  const userInfo = {
    name: fullName || 'Collaborator',
    avatar: user[0]?.imageUrl || '',
    color: getPresenceColor(userId),
  };

  const session = liveblocks.prepareSession(userId, { userInfo });
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
