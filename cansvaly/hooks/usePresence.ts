import { useCallback, useRef } from 'react';
import { useMyPresence, useOthers } from '@/lib/liveblocks';
import { CURSOR_THROTTLE_MS } from '@/lib/constants';

export function usePresence() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const lastBroadcastRef = useRef<number>(0);

  const updateCursor = useCallback(
    (cursor: { x: number; y: number } | null) => {
      const now = Date.now();
      if (now - lastBroadcastRef.current >= CURSOR_THROTTLE_MS) {
        lastBroadcastRef.current = now;
        updateMyPresence({ cursor });
      }
    },
    [updateMyPresence]
  );

  return {
    myPresence,
    updateMyPresence,
    updateCursor,
    others,
  };
}
