import { create } from 'zustand';

interface ModalState {
  isNewBoardOpen: boolean;
  isSearchOpen: boolean;
  isShareOpen: boolean;
  activeShareBoardId: string;
  activeShareBoardTitle: string;
  
  isRenameOpen: boolean;
  activeRenameBoardId: string;
  activeRenameBoardTitle: string;

  isDeleteOpen: boolean;
  activeDeleteBoardId: string;
  activeDeleteBoardTitle: string;

  openNewBoard: () => void;
  closeNewBoard: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openShare: (boardId: string, boardTitle?: string) => void;
  closeShare: () => void;

  openRename: (boardId: string, currentTitle: string) => void;
  closeRename: () => void;

  openDelete: (boardId: string, boardTitle: string) => void;
  closeDelete: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isNewBoardOpen: false,
  isSearchOpen: false,
  isShareOpen: false,
  activeShareBoardId: '',
  activeShareBoardTitle: 'Board',

  isRenameOpen: false,
  activeRenameBoardId: '',
  activeRenameBoardTitle: '',

  isDeleteOpen: false,
  activeDeleteBoardId: '',
  activeDeleteBoardTitle: '',

  openNewBoard: () => set({ isNewBoardOpen: true }),
  closeNewBoard: () => set({ isNewBoardOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openShare: (boardId: string, title = 'Board') => set({ isShareOpen: true, activeShareBoardId: boardId, activeShareBoardTitle: title }),
  closeShare: () => set({ isShareOpen: false }),

  openRename: (boardId: string, currentTitle: string) => set({ isRenameOpen: true, activeRenameBoardId: boardId, activeRenameBoardTitle: currentTitle }),
  closeRename: () => set({ isRenameOpen: false }),

  openDelete: (boardId: string, boardTitle: string) => set({ isDeleteOpen: true, activeDeleteBoardId: boardId, activeDeleteBoardTitle: boardTitle }),
  closeDelete: () => set({ isDeleteOpen: false }),
}));
