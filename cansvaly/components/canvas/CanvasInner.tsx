'use client';

import React, { useState } from 'react';
import { Tldraw, Editor } from 'tldraw';
import { usePresence } from '@/hooks/usePresence';
import { BoardHeader } from '@/components/canvas/BoardHeader';
import { Toolbar } from '@/components/canvas/Toolbar';
import { Cursors } from '@/components/canvas/Cursors';
import { CanvasComments } from '@/components/canvas/CanvasComments';
import { ZoomControls } from '@/components/canvas/ZoomControls';
import 'tldraw/tldraw.css';

interface CanvasInnerProps {
  boardId: string;
  boardTitle: string;
}

export function CanvasInner({ boardId, boardTitle }: CanvasInnerProps) {
  const { updateCursor } = usePresence();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [zoom, setZoom] = useState(100);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateCursor({ x: e.clientX, y: e.clientY });
  };

  const handlePointerLeave = () => {
    updateCursor(null);
  };

  const handleMount = (mountedEditor: Editor) => {
    setEditor(mountedEditor);
    mountedEditor.on('change', () => {
      const currentZoom = mountedEditor.getZoomLevel() * 100;
      setZoom(currentZoom);
    });
  };

  return (
    <div
      className="relative h-full w-full bg-background overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <BoardHeader boardId={boardId} initialTitle={boardTitle} />

      <Toolbar />

      <Cursors />

      <CanvasComments boardId={boardId} />

      <ZoomControls
        zoom={zoom}
        onZoomIn={() => editor?.zoomIn()}
        onZoomOut={() => editor?.zoomOut()}
        onResetZoom={() => editor?.resetZoom()}
      />

      <div className="absolute inset-0 z-0">
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  );
}
