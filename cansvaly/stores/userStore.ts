import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export interface UserState {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  bio: string | null;
  jobTitle: string | null;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

export type UserStore = ReturnType<typeof createUserStore>;

export const createUserStore = (initProps?: Partial<UserState>) => {
  return createStore<UserState>()((set) => ({
    id: initProps?.id ?? null,
    email: initProps?.email ?? null,
    firstName: initProps?.firstName ?? null,
    lastName: initProps?.lastName ?? null,
    imageUrl: initProps?.imageUrl ?? null,
    bio: initProps?.bio ?? null,
    jobTitle: initProps?.jobTitle ?? null,
    setUser: (userData) => set((state) => ({ ...state, ...userData })),
    clearUser: () =>
      set({
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        imageUrl: null,
        bio: null,
        jobTitle: null,
      }),
  }));
};
