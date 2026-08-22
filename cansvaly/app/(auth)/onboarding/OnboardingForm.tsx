'use client';

import { useState } from 'react';
import { completeOnboarding } from './actions';
import { Button } from '@/components/ui/button';
import { Sparkles, Briefcase, FileText } from 'lucide-react';

export function OnboardingForm({
  userFirstName,
}: {
  userFirstName: string;
}) {
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await completeOnboarding({ jobTitle, bio });
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError(err?.message || 'Failed to complete onboarding');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="p-3 text-xs font-medium rounded-md bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Briefcase className="size-4 text-primary" /> What is your role or job title?
          </label>
          <input
            type="text"
            placeholder="e.g. Product Designer, Software Engineer, Founder"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <FileText className="size-4 text-muted-foreground" /> Short bio (optional)
          </label>
          <textarea
            rows={3}
            placeholder="What will you be using Canvasly for?"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-sm font-semibold gap-2 cursor-pointer"
      >
        <Sparkles className="size-4" />
        {loading ? 'Setting up workspace...' : 'Get Started with Canvasly'}
      </Button>
    </form>
  );
}
