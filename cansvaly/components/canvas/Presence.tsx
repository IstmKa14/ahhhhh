'use client';

import React from 'react';
import { useOthers, useSelf } from '@/lib/liveblocks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Presence() {
  const others = useOthers();
  const self = useSelf();

  const maxVisible = 4;
  const visibleOthers = others.slice(0, maxVisible);
  const hiddenCount = Math.max(0, others.length - maxVisible);

  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2 overflow-hidden">
        {self && (
          <Tooltip key="self">
            <TooltipTrigger
              render={
                <div className="cursor-pointer">
                  <Avatar className="h-8 w-8 ring-2 ring-primary">
                    <AvatarImage src={self.info?.avatar || ''} alt={self.info?.name || 'You'} />
                    <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                      {(self.info?.name || 'You').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              }
            />
            <TooltipContent side="bottom">
              <p className="text-xs">{self.info?.name || 'You'} (You)</p>
            </TooltipContent>
          </Tooltip>
        )}

        {visibleOthers.map(({ connectionId, info }) => {
          const name = info?.name || 'Collaborator';
          const avatar = info?.avatar || '';
          const color = info?.color || '#5b4eff';

          return (
            <Tooltip key={connectionId}>
              <TooltipTrigger
                render={
                  <div className="cursor-pointer">
                    <Avatar className="h-8 w-8 ring-2" style={{ borderColor: color }}>
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                        {name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                }
              />
              <TooltipContent side="bottom">
                <p className="text-xs">{name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {hiddenCount > 0 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background text-xs font-medium text-muted-foreground">
            +{hiddenCount}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
