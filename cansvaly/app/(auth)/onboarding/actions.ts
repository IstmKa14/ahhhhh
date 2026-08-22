'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const onboardingSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  bio: z.string().max(280, 'Bio must be under 280 characters').optional(),
});

export async function completeOnboarding(formData: { jobTitle: string; bio?: string }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const clerkUser = await currentUser();
  const primaryEmail =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    '';

  const validated = onboardingSchema.parse(formData);

  if (db) {
    const existingUsers = await db.select().from(users).where(eq(users.id, userId));
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        id: userId,
        email: primaryEmail,
        firstName: clerkUser?.firstName ?? null,
        lastName: clerkUser?.lastName ?? null,
        imageUrl: clerkUser?.imageUrl ?? null,
        jobTitle: validated.jobTitle,
        bio: validated.bio ?? null,
      });
    } else {
      await db
        .update(users)
        .set({
          jobTitle: validated.jobTitle,
          bio: validated.bio ?? null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
