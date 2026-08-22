'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useModalStore } from '@/stores/modalStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteBoardAction } from '@/app/(dashboard)/actions';

export function DeleteModal() {
  const { isDeleteOpen, closeDelete, activeDeleteBoardId, activeDeleteBoardTitle } = useModalStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!activeDeleteBoardId) return;

    setIsSubmitting(true);
    try {
      await deleteBoardAction(activeDeleteBoardId);
      closeDelete();
    } catch (err) {
      console.error('Failed to delete board:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && closeDelete()}>
      <DialogContent className="sm:max-w-[420px] bg-card border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete &quot;{activeDeleteBoardTitle}&quot;?</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            This action cannot be undone. All shapes, drawings, comments, and real-time collaboration history will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 flex items-center justify-end gap-2 border-t border-border">
          <Button type="button" variant="outline" onClick={closeDelete} className="h-9 text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="h-9 text-xs font-semibold"
          >
            {isSubmitting ? 'Deleting...' : 'Permanently Delete Board'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
