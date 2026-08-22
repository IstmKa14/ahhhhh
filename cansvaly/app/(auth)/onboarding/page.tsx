import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { OnboardingForm } from './OnboardingForm';
import { Logo } from '@/components/shared/Logo';

export const metadata = {
  title: 'Welcome to Canvasly — Quick Setup',
};

export default async function OnboardingPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  const firstName = clerkUser.firstName || 'there';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Welcome, {firstName}! 🎉
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Let's quickly set up your Canvasly profile to get you drawing and collaborating with your team.
          </p>
        </div>

        <OnboardingForm userFirstName={firstName} />
      </div>
    </div>
  );
}
