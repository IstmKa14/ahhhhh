'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Star, Users, Settings, User, PanelLeftClose, PanelLeft, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarStore } from '@/stores/sidebarStore';

const navItems = [
  { label: 'All Boards', href: '/', icon: LayoutGrid },
  { label: 'Favorites', href: '/?filter=favorites', icon: Star },
  { label: 'Shared with me', href: '/?filter=shared', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full py-4 space-y-6">
      <div className={cn('flex items-center px-4', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && <Logo />}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        <TooltipProvider>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            if (collapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent mx-auto">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex h-full w-full items-center justify-center',
                        isActive && 'bg-accent text-primary font-medium rounded-lg'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent',
                  isActive && 'bg-accent text-primary font-semibold'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out shrink-0',
          isCollapsed ? 'w-[64px]' : 'w-[240px]'
        )}
      >
        <NavContent collapsed={isCollapsed} />
      </aside>

      <div className="md:hidden flex items-center p-2 border-b border-border bg-card">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="p-2 text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0 bg-card">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <NavContent collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
