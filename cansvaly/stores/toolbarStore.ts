import { create } from 'zustand';

export type CanvasTool =
  | 'select'
  | 'hand'
  | 'draw'
  | 'eraser'
  | 'rectangle'
  | 'ellipse'
  | 'arrow'
  | 'text'
  | 'note'
  | 'comment';

interface ToolbarState {
  activeTool: CanvasTool;
  strokeColor: string;
  fillColor: string;
  strokeWidth: 'small' | 'medium' | 'large';
  isCommentsPanelOpen: boolean;
  setActiveTool: (tool: CanvasTool) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: 'small' | 'medium' | 'large') => void;
  toggleCommentsPanel: () => void;
  setCommentsPanelOpen: (open: boolean) => void;
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeTool: 'select',
  strokeColor: '#0f0f11',
  fillColor: 'transparent',
  strokeWidth: 'medium',
  isCommentsPanelOpen: false,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  toggleCommentsPanel: () => set((state) => ({ isCommentsPanelOpen: !state.isCommentsPanelOpen })),
  setCommentsPanelOpen: (open) => set({ isCommentsPanelOpen: open }),
}));
