'use client';

import * as React from 'react';
import { Pencil } from 'lucide-react';
import { useModalStore } from '@/stores/modalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { renameBoardAction } from '@/app/(dashboard)/actions';

export function RenameModal() {
  const { isRenameOpen, closeRename, activeRenameBoardId, activeRenameBoardTitle } = useModalStore();
  const [title, setTitle] = React.useState(activeRenameBoardTitle);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setTitle(activeRenameBoardTitle);
  }, [activeRenameBoardTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeRenameBoardId) return;

    setIsSubmitting(true);
    try {
      await renameBoardAction(activeRenameBoardId, title.trim());
      closeRename();
    } catch (err) {
      console.error('Failed to rename board:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isRenameOpen} onOpenChange={(open) => !open && closeRename()}>
      <DialogContent className="sm:max-w-[420px] bg-card border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="h-5 w-5 text-primary" />
            <span>Rename Board</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Give your collaborative whiteboard a clear, descriptive new title.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Board Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Architecture 2026"
              className="h-10 text-sm bg-background border-input focus-visible:ring-primary"
              autoFocus
              required
            />
          </div>

          <DialogFooter className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <Button type="button" variant="outline" onClick={closeRename} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting} className="h-9 text-xs font-semibold">
              {isSubmitting ? 'Saving...' : 'Save Title'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
