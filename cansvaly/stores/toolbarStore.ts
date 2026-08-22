import { create } from 'zustand';
import type { Editor } from 'tldraw';

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
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  setActiveTool: (tool: CanvasTool) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: 'small' | 'medium' | 'large') => void;
  toggleCommentsPanel: () => void;
  setCommentsPanelOpen: (open: boolean) => void;
}

export const useToolbarStore = create<ToolbarState>((set, get) => ({
  activeTool: 'select',
  strokeColor: '#0f0f11',
  fillColor: 'transparent',
  strokeWidth: 'medium',
  isCommentsPanelOpen: false,
  editor: null,
  setEditor: (editor) => set({ editor }),
  setActiveTool: (tool) => {
    set({ activeTool: tool });
    const { editor } = get();
    if (!editor) {
      return;
    }

    switch (tool) {
      case 'select':
        editor.setCurrentTool('select');
        break;
      case 'hand':
        editor.setCurrentTool('hand');
        break;
      case 'draw':
        editor.setCurrentTool('draw');
        break;
      case 'eraser':
        editor.setCurrentTool('eraser');
        break;
      case 'arrow':
        editor.setCurrentTool('arrow');
        break;
      case 'text':
        editor.setCurrentTool('text');
        break;
      case 'note':
        editor.setCurrentTool('note');
        break;
      case 'rectangle':
        editor.setCurrentTool('geo', { geo: 'rectangle' });
        break;
      case 'ellipse':
        editor.setCurrentTool('geo', { geo: 'ellipse' });
        break;
      case 'comment':
        editor.setCurrentTool('select');
        set({ isCommentsPanelOpen: true });
        break;
    }
  },
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  toggleCommentsPanel: () => set((state) => ({ isCommentsPanelOpen: !state.isCommentsPanelOpen })),
  setCommentsPanelOpen: (open) => set({ isCommentsPanelOpen: open }),
}));
