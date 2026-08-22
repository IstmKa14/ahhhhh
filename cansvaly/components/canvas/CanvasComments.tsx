'use client';

import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Thread } from '@liveblocks/react-ui';
import { useThreads, useCreateThread } from '@/lib/liveblocks';
import { useToolbarStore } from '@/stores/toolbarStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '@liveblocks/react-ui/styles.css';

interface CanvasCommentsProps {
  boardId: string;
}

export function CanvasComments({ boardId }: CanvasCommentsProps) {
  const { threads } = useThreads();
  const createThread = useCreateThread();
  const { activeTool, isCommentsPanelOpen, setCommentsPanelOpen, setActiveTool } = useToolbarStore();

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'comment') {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createThread({
      body: {
        version: 1,
        content: [
          {
            type: 'paragraph',
            children: [{ text: 'New comment thread' }],
          },
        ],
      },
      metadata: {
        boardId,
        x,
        y,
        resolved: false,
      },
    });

    setActiveTool('select');
  };

  return (
    <>
      <div
        className={cn(
          'absolute inset-0 z-30',
          activeTool === 'comment' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
        )}
        onClick={handleCanvasClick}
      >
        {threads?.map((thread) => {
          const { x, y } = thread.metadata;
          if (typeof x !== 'number' || typeof y !== 'number') {
            return null;
          }

          return (
            <div
              key={thread.id}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-110 transition-transform"
                onClick={() => setCommentsPanelOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {isCommentsPanelOpen && (
        <aside className="absolute right-0 top-14 bottom-0 z-40 w-80 border-l border-border bg-card shadow-xl p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Board Comments</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setCommentsPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {threads && threads.length > 0 ? (
              threads.map((thread) => (
                <div key={thread.id} className="rounded-xl border border-border bg-background p-2">
                  <Thread thread={thread} />
                </div>
              ))
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center p-6">
                <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">No comments yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Select the comment tool and click anywhere on the canvas to start a discussion.
                </p>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
