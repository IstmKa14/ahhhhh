'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/modalStore';

interface NewBoardButtonProps {
  onClick?: () => void;
}

export function NewBoardButton({ onClick }: NewBoardButtonProps) {
  const { openNewBoard } = useModalStore();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openNewBoard();
    }
  };

  return (
    <Button onClick={handleClick} size="sm" className="gap-2 font-medium cursor-pointer">
      <Plus className="h-4 w-4" />
      <span>New Board</span>
    </Button>
  );
}
