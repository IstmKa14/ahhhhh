import { syncOrCreateUser } from './actions';
import { ProfileForm } from './ProfileForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'User Profile — Canvasly',
};

export default async function ProfilePage() {
  const user = await syncOrCreateUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="container max-w-4xl py-10 px-4 mx-auto space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal account information and custom database profile.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
