# Spec 0002: Dashboard Server Actions & Drizzle Persistence

**Status**: Ready for Implementation

## Summary & Requirements

This spec details the full backend integration, database persistence, and Server Actions for the Canvasly Dashboard (`app/(dashboard)`). It replaces all remaining mock data and client stubs with real Neon PostgreSQL database queries via Drizzle ORM, Clerk authentication verification (`auth()`), Liveblocks room creation/deletion, and optimistic UI state management.

### Acceptance Criteria
1. **Real-time Board Queries (`getBoards`)**:
   - Fetch boards from Neon DB based on user Clerk ID (`createdById` or membership in `board_members`).
   - Support active filters: `all`, `favorites`, and `shared`.
   - Calculate member counts and collaborator avatars per board card.

2. **Board Creation Action (`createBoardAction`)**:
   - Accepts title, description, starter template, access level (`isPublic`), and optional accent color.
   - Inserts record into `boards` table and owner record into `board_members` table with `role = 'owner'`.
   - Generates a unique Liveblocks room ID (`board-{uuid}`).
   - Revalidates path `/` and returns created board ID for immediate navigation.

3. **Favorite Toggle Action (`toggleFavoriteBoardAction`)**:
   - Toggles `isFavorited` state in `boards` table.
   - Optimistically updates UI card star state instantly.

4. **Board Rename Action (`renameBoardAction`)**:
   - Validates input with Zod schema (`renameBoardSchema`).
   - Updates title in Neon DB and revalidates dashboard cache.

5. **Board Deletion Action (`deleteBoardAction`)**:
   - Verifies owner role in `board_members` or `createdById`.
   - Performs cascade deletion on `boards`, `board_members`, `board_activity`, `comments`, `board_shares`.
   - Calls Liveblocks REST API to delete room instance.

6. **Search & Command Palette Action (`searchBoardsAction`)**:
   - Real-time ILIKE query against `title` and `description` in Drizzle.
   - Returns top 10 matching boards for user.

7. **Share & Collaborator Management Actions (`inviteCollaboratorAction`, `updateMemberRoleAction`, `removeMemberAction`, `togglePublicShareAction`)**:
   - Checks if collaborator exists in `users` table by email (or syncs via Clerk API).
   - Inserts or updates row in `board_members` (`role`: `'owner' | 'editor' | 'viewer' | 'commenter'`).
   - Generates shareable link token in `board_shares`.

---

## Step 1: Global Setup & Schema Invariants

### Database Schema Alignment (`db/schema.ts`)
Ensure the following Drizzle tables are imported and used in Server Actions:
- `users`
- `boards`
- `boardMembers`
- `boardActivity`
- `boardShares`

### Server Action Location
Create all dashboard server actions in `app/(dashboard)/actions.ts` to keep pages thin and server logic strictly isolated.

---

## UI & Architecture

### Layout & Action Flow
```
app/(dashboard)/
├── actions.ts                     — Server Actions (create, rename, delete, favorite, share, search)
├── page.tsx                       — Server Component fetching real boards from Drizzle
├── boards/page.tsx                — Redirect or list view
components/
├── dashboard/
│   ├── NewBoardButton.tsx         — Triggers modal store
│   └── DashboardHeader.tsx        — Passes search action to SearchCommandModal
├── board/
│   ├── BoardCard.tsx              — Connected to optimistic Server Actions
│   └── BoardGrid.tsx              — Connected to real Drizzle board objects
└── modals/
    ├── NewBoardModal.tsx          — Invokes createBoardAction
    ├── SearchCommandModal.tsx     — Invokes searchBoardsAction
    └── ShareModal.tsx             — Invokes inviteCollaboratorAction & togglePublicShareAction
```

---

## Technical Specifications & Interfaces

### 1. Zod Validation Schemas (`lib/validations.ts`)
```typescript
import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  template: z.enum(['blank', 'flowchart', 'brainstorming', 'wireframe']).default('blank'),
  isPublic: z.boolean().default(false),
});

export const renameBoardSchema = z.object({
  boardId: z.string().uuid(),
  title: z.string().min(1).max(100),
});

export const inviteCollaboratorSchema = z.object({
  boardId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['editor', 'viewer', 'commenter']),
});
```

### 2. Server Action Specifications (`app/(dashboard)/actions.ts`)

```typescript
'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { boards, boardMembers, users, boardShares } from '@/db/schema';
import { eq, and, ilike, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createBoardSchema, renameBoardSchema, inviteCollaboratorSchema } from '@/lib/validations';

export async function createBoardAction(input: z.infer<typeof createBoardSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createBoardSchema.parse(input);
  const roomId = `board-${crypto.randomUUID()}`;

  // Insert user if not exists (sync fallback)
  const clerkUser = await currentUser();
  if (clerkUser) {
    await db.insert(users).values({
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'Anonymous User',
      avatarUrl: clerkUser.imageUrl,
    }).onConflictDoNothing();
  }

  const [newBoard] = await db.insert(boards).values({
    title: validated.title,
    description: validated.description,
    createdById: userId,
    isPublic: validated.isPublic,
    liveblocksRoomId: roomId,
  }).returning();

  await db.insert(boardMembers).values({
    id: crypto.randomUUID(),
    boardId: newBoard.id,
    userId: userId,
    role: 'owner',
  });

  revalidatePath('/');
  return { success: true, boardId: newBoard.id };
}

export async function toggleFavoriteBoardAction(boardId: string, currentFavorited: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.update(boards)
    .set({ isFavorited: !currentFavorited, updatedAt: new Date() })
    .where(and(eq(boards.id, boardId), eq(boards.createdById, userId)));

  revalidatePath('/');
  return { success: true };
}

export async function renameBoardAction(boardId: string, newTitle: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = renameBoardSchema.parse({ boardId, title: newTitle });

  await db.update(boards)
    .set({ title: validated.title, updatedAt: new Date() })
    .where(eq(boards.id, validated.boardId));

  revalidatePath('/');
  return { success: true };
}

export async function deleteBoardAction(boardId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.delete(boards).where(and(eq(boards.id, boardId), eq(boards.createdById, userId)));

  revalidatePath('/');
  return { success: true };
}

export async function searchBoardsAction(query: string) {
  const { userId } = await auth();
  if (!userId) return [];

  if (!query.trim()) return [];

  return await db.select({
    id: boards.id,
    title: boards.title,
    description: boards.description,
    updatedAt: boards.updatedAt,
  })
  .from(boards)
  .where(and(
    eq(boards.createdById, userId),
    or(ilike(boards.title, `%${query}%`), ilike(boards.description, `%${query}%`))
  ))
  .limit(10);
}
```

---

## Build Plan

1. **Validation Schemas & Server Action Utilities**:
   - Export schemas in `lib/validations.ts`.
   - Create `app/(dashboard)/actions.ts` with database logic.

2. **Connect Dashboard Route**:
   - Refactor `app/(dashboard)/page.tsx` to query Drizzle DB directly via Server Components and pass real board data to `BoardGrid`.

3. **Wire Modal Components to Server Actions**:
   - Connect `NewBoardModal.tsx` to `createBoardAction` with loading state & toast/redirection.
   - Connect `SearchCommandModal.tsx` to `searchBoardsAction`.
   - Connect `ShareModal.tsx` to collaborator actions.

4. **Wire Board Card Actions**:
   - Wire `toggleFavoriteBoardAction`, `renameBoardAction`, and `deleteBoardAction` in `BoardCard.tsx`.

5. **Verification**:
   - Verify zero TypeScript compiler errors.
   - Test board creation, renaming, favoriting, searching, and deleting end-to-end.

---

## Completion Instruction
Do not write implementation code during spec generation. Once approved, invoke `/istm-develop` to begin implementation based on this spec.
