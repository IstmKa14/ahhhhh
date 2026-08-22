'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Star, Users, Settings, User, Plus } from 'lucide-react';
import { useModalStore } from '@/stores/modalStore';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command';

export function SearchCommandModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch, toggleSearch, openNewBoard } = useModalStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleSearch]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      closeSearch();
      command();
    },
    [closeSearch]
  );

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()}>
      <CommandInput placeholder="Type a command or search boards..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                openNewBoard();
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Board</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>All Boards</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/?filter=favorites'))}>
            <Star className="mr-2 h-4 w-4" />
            <span>Favorite Boards</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/?filter=shared'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Shared with Me</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/profile'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
