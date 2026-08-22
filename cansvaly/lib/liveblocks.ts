import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';
import type { Presence, Storage, UserMeta, RoomEvent, ThreadMetadata } from '@/types/liveblocks';

export const client = createClient({
  authEndpoint: '/api/liveblocks-auth',
});

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useSelf,
  useThreads,
  useCreateThread,
  useCreateComment,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);
