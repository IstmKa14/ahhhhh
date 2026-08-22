export type Presence = {
  cursor: { x: number; y: number } | null;
  selectedShapeIds: string[];
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    color: string;
  };
};

export type Storage = Record<string, never>;

export type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
    color: string;
  };
};

export type RoomEvent = {
  type: 'NOTIFICATION';
  message: string;
};

export type ThreadMetadata = {
  boardId: string;
  x: number;
  y: number;
  resolved: boolean;
};
