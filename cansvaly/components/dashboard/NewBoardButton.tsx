'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewBoardButtonProps {
  onClick?: () => void;
}

export function NewBoardButton({ onClick }: NewBoardButtonProps) {
  return (
    <Button onClick={onClick} size="sm" className="gap-2 font-medium">
      <Plus className="h-4 w-4" />
      <span>New Board</span>
    </Button>
  );
}
