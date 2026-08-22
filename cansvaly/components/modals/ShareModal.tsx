'use client';

import * as React from 'react';
import { Copy, Check, UserPlus, Link as LinkIcon, Shield, Mail } from 'lucide-react';
import { useModalStore } from '@/stores/modalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function ShareModal() {
  const { isShareOpen, closeShare, activeShareBoardTitle } = useModalStore();
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<'editor' | 'viewer' | 'commenter'>('editor');
  const [invited, setInvited] = React.useState(false);

  const shareableUrl = typeof window !== 'undefined' ? `${window.location.origin}/board/share-preview` : 'https://canvasly.app/board/share-preview';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInvited(true);
    setTimeout(() => {
      setEmail('');
      setInvited(false);
    }, 2000);
  };

  return (
    <Dialog open={isShareOpen} onOpenChange={(open) => !open && closeShare()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span>Share &quot;{activeShareBoardTitle}&quot;</span>
          </DialogTitle>
          <DialogDescription>
            Invite teammates by email or share a direct link for real-time collaboration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Invite by Email */}
          <form onSubmit={handleInvite} className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Invite collaborators</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="h-9 px-3 border border-input rounded-md text-xs font-medium bg-background hover:bg-accent flex items-center gap-1.5 capitalize">
                  {role}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setRole('editor')}>Can edit (Editor)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole('commenter')}>Can comment</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole('viewer')}>Can view (Viewer)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button type="submit" size="sm" disabled={!email.trim()}>
                {invited ? 'Sent!' : 'Send Invite'}
              </Button>
            </div>
          </form>

          {/* Copy Share Link */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-semibold text-foreground">Share via link</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input readOnly value={shareableUrl} className="pl-9 h-9 text-xs font-mono bg-muted/40" />
              </div>
              <Button size="sm" variant="outline" onClick={handleCopyLink} className="gap-1.5">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied' : 'Copy link'}</span>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Anyone with this link can view and join this board in real time.
            </p>
          </div>

          {/* Members list */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-semibold text-foreground">People with access</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">YOU</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">You (Workspace Owner)</p>
                    <p className="text-[11px] text-muted-foreground truncate">Owner</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
                  Owner
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
