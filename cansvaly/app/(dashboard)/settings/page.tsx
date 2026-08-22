'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = React.useState('Personal Workspace');
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container max-w-4xl py-6 mx-auto space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your collaborative whiteboard workspace preferences and defaults.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Workspace Profile</CardTitle>
            </div>
            <CardDescription>Update your workspace display name and team branding defaults.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Workspace Name</label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Enter workspace name"
                />
              </div>
              <Button type="submit" size="sm">
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Canvas Defaults</CardTitle>
            </div>
            <CardDescription>Default grid style and theme preferences for new whiteboards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-accent/30">
              <div>
                <p className="text-sm font-medium text-foreground">Default Canvas Background</p>
                <p className="text-xs text-muted-foreground">Light background in daytime mode, dark warm slate in dark mode.</p>
              </div>
              <span className="text-xs font-semibold text-primary">System Theme</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Control email and real-time activity updates for shared boards.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Real-time collaboration alerts are enabled for active Liveblocks rooms.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
