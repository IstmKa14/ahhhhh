export const PRESENCE_COLORS = [
  "#ff6b6b", // Coral
  "#06d6a0", // Teal
  "#ffd166", // Amber
  "#118ab2", // Sky
  "#ef476f", // Rose
  "#9d8df1", // Lavender
] as const;

export type PresenceColor = (typeof PRESENCE_COLORS)[number];

export function getPresenceColor(userId: string): PresenceColor {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PRESENCE_COLORS[Math.abs(hash) % PRESENCE_COLORS.length];
}
