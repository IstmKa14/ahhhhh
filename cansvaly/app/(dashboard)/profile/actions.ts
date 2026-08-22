'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  bio: z.string().max(280, 'Bio must be under 280 characters').optional(),
  jobTitle: z.string().max(100).optional(),
});

export async function syncOrCreateUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? '';

  if (!db) {
    return {
      id: clerkUser.id,
      email: primaryEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      bio: null,
      jobTitle: null,
    };
  }

  try {
    // Check if user exists in DB
    const existingUsers = await db.select().from(users).where(eq(users.id, userId));

    if (existingUsers.length === 0) {
      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          email: primaryEmail,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        })
        .returning();
      return newUser;
    }

    return existingUsers[0];
  } catch (error) {
    console.warn('Database query failed (DB tables may be pending migration). Falling back to Clerk profile data:', error);
    return {
      id: clerkUser.id,
      email: primaryEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      bio: null,
      jobTitle: null,
    };
  }
}

export async function updateUserProfile(formData: {
  firstName: string;
  lastName: string;
  bio?: string;
  jobTitle?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const validated = updateProfileSchema.parse(formData);

  if (!db) {
    throw new Error('Database connection not configured');
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      firstName: validated.firstName,
      lastName: validated.lastName,
      bio: validated.bio ?? null,
      jobTitle: validated.jobTitle ?? null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  revalidatePath('/profile');
  return updatedUser;
}
