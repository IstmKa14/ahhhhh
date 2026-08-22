'use client';

import React from 'react';
import { useOthers } from '@/lib/liveblocks';

export function Cursors() {
  const others = useOthers();

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {others.map(({ connectionId, presence, info }) => {
        if (!presence?.cursor) {
          return null;
        }

        const { x, y } = presence.cursor;
        const color = info?.color || presence.user?.color || '#5b4eff';
        const name = info?.name || presence.user?.name || 'Collaborator';
        const firstName = name.split(' ')[0].slice(0, 12);

        return (
          <div
            key={connectionId}
            className="absolute left-0 top-0 transition-transform duration-75 ease-out"
            style={{
              transform: `translate3d(${x}px, ${y}px, 0)`,
            }}
          >
            <svg
              className="h-5 w-5 drop-shadow-sm"
              style={{ color }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5.653 3.123A1.5 1.5 0 0 0 3 4.218v15.564a1.5 1.5 0 0 0 2.457 1.156l4.635-3.863a1.5 1.5 0 0 1 .96-.34h6.731a1.5 1.5 0 0 0 1.06-2.56L5.653 3.123z" />
            </svg>
            <div
              className="ml-4 mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              {firstName}
            </div>
          </div>
        );
      })}
    </div>
  );
}
