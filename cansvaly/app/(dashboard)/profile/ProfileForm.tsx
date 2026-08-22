'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from './actions';
import { User } from '@/db/schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserCheck, Shield, Mail, Key, User as UserIcon, Briefcase, FileText } from 'lucide-react';

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    bio: string | null;
    jobTitle: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateUserProfile({
        firstName,
        lastName,
        bio,
        jobTitle,
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      router.refresh();
    } catch (err: any) {
      setMessage({ text: err?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initial = (firstName?.[0] || 'U').toUpperCase();

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Account Info Banner */}
      <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4 shadow-xs">
        <Avatar size="lg" className="size-16">
          <AvatarImage src={user.imageUrl || undefined} alt={firstName || 'User Avatar'} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            {firstName} {lastName}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Clerk Authenticated
            </span>
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
          <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5 mt-1 font-mono">
            <Key className="w-3 h-3" /> ID: {user.id}
          </p>
        </div>
      </div>

      {/* Message Feedback */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Custom Profile Edit Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-border space-y-6 shadow-xs">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your account details and stored database profile attributes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-muted-foreground" /> First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-muted-foreground" /> Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-muted-foreground" /> Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. Product Designer, Lead Architect"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-muted-foreground" /> Bio
          </label>
          <textarea
            rows={3}
            placeholder="Tell us a little bit about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Security & Sync Details */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Security & Database Synchronization
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your primary identity and sessions are authenticated via Clerk. User IDs and profile meta-data are stored and synchronized directly in Neon PostgreSQL via Drizzle ORM.
        </p>
      </div>
    </div>
  );
}
