'use client';

import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function CustomUserButton() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded || !user) {
    return <Avatar size="default" className="animate-pulse" />;
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress || '';
  const fullName = user.fullName || user.firstName || 'User';
  const initial = fullName[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer">
        <Avatar size="default">
          <AvatarImage src={user.imageUrl || undefined} alt={fullName} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 p-1.5" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarImage src={user.imageUrl || undefined} alt={fullName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 min-w-0">
                <p className="text-sm font-semibold leading-none truncate">{fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{primaryEmail}</p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => (window.location.href = '/profile')}>
          <User className="size-4 text-muted-foreground" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await signOut();
            window.location.href = '/';
          }}
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
