'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Presence } from '@/components/canvas/Presence';
import { useModalStore } from '@/stores/modalStore';
import { useToolbarStore } from '@/stores/toolbarStore';
import { renameBoardAction } from '@/app/(dashboard)/actions';
import { Logo } from '@/components/shared/Logo';

interface BoardHeaderProps {
  boardId: string;
  initialTitle: string;
}

export function BoardHeader({ boardId, initialTitle }: BoardHeaderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { openShare } = useModalStore();
  const { toggleCommentsPanel, isCommentsPanelOpen } = useToolbarStore();

  const handleSaveTitle = async () => {
    if (!title.trim() || title === initialTitle) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await renameBoardAction(boardId, title.trim());
    } catch {
      setTitle(initialTitle);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <Logo iconOnly className="h-7 w-7" />

        <div className="h-4 w-px bg-border mx-1" />

        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveTitle();
                } else if (e.key === 'Escape') {
                  setTitle(initialTitle);
                  setIsEditing(false);
                }
              }}
              onBlur={handleSaveTitle}
              autoFocus
              className="h-8 w-48 text-sm font-semibold"
            />
            {isSaving && <Check className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md px-2 py-1 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            {title}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Presence />

        <Button
          variant="outline"
          size="sm"
          onClick={() => openShare(boardId, title)}
          className="gap-2 border-border font-medium shadow-sm hover:bg-accent"
        >
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span>Share</span>
        </Button>

        <Button
          variant={isCommentsPanelOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleCommentsPanel}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
