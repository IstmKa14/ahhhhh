'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star, MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface BoardCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  isFavorited: boolean;
  updatedAt: string;
  ownerName: string;
  ownerAvatar?: string;
  onFavoriteToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function BoardCard({
  id,
  title,
  thumbnailUrl,
  isFavorited,
  updatedAt,
  ownerName,
  ownerAvatar,
  onFavoriteToggle,
  onDelete,
  onRename,
  onDuplicate,
}: BoardCardProps) {
  const [favorited, setFavorited] = React.useState(isFavorited);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    onFavoriteToggle?.(id);
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
      <Link href={`/board/${id}`} className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent/40 text-muted-foreground/60">
            <div className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center text-primary shadow-xs">
                <span className="font-mono text-xs font-bold">BD</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground/80">Canvasly Board</span>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavorite}
          className={cn(
            'absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150',
            favorited && 'opacity-100 text-amber-500 hover:text-amber-600'
          )}
          aria-label={favorited ? 'Unfavorite board' : 'Favorite board'}
        >
          <Star className={cn('h-4 w-4', favorited && 'fill-current')} />
        </Button>
      </Link>

      <div className="flex items-center justify-between p-3.5 gap-2">
        <div className="min-w-0 flex-1">
          <Link href={`/board/${id}`} className="hover:underline">
            <h4 className="text-sm font-semibold tracking-tight text-foreground truncate">{title}</h4>
          </Link>
          <p className="text-xs text-muted-foreground truncate mt-0.5">Updated {updatedAt}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Avatar className="h-6 w-6">
            {ownerAvatar && <AvatarImage src={ownerAvatar} alt={ownerName} />}
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
              {ownerName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Board actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onRename?.(id)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(id)}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFavorite}>
                <Star className="mr-2 h-3.5 w-3.5" />
                <span>{favorited ? 'Unfavorite' : 'Favorite'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
