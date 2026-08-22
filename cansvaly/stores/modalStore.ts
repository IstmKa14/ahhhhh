import { create } from 'zustand';

interface ModalState {
  isNewBoardOpen: boolean;
  isSearchOpen: boolean;
  isShareOpen: boolean;
  activeShareBoardTitle: string;
  openNewBoard: () => void;
  closeNewBoard: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openShare: (boardTitle?: string) => void;
  closeShare: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isNewBoardOpen: false,
  isSearchOpen: false,
  isShareOpen: false,
  activeShareBoardTitle: 'Board',
  openNewBoard: () => set({ isNewBoardOpen: true }),
  closeNewBoard: () => set({ isNewBoardOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openShare: (title = 'Board') => set({ isShareOpen: true, activeShareBoardTitle: title }),
  closeShare: () => set({ isShareOpen: false }),
}));
