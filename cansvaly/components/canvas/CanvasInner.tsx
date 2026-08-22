'use client';

import React, { useState } from 'react';
import { Tldraw, Editor } from 'tldraw';
import { usePresence } from '@/hooks/usePresence';
import { useToolbarStore } from '@/stores/toolbarStore';
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
  const { setEditor } = useToolbarStore();
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [zoom, setZoom] = useState(100);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editorInstance) {
      const pagePoint = editorInstance.screenToPage({ x: e.clientX, y: e.clientY });
      updateCursor({ x: pagePoint.x, y: pagePoint.y });
    } else {
      updateCursor({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerLeave = () => {
    updateCursor(null);
  };

  const handleMount = (mountedEditor: Editor) => {
    setEditorInstance(mountedEditor);
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

      <Cursors editor={editorInstance} />

      <CanvasComments boardId={boardId} />

      <ZoomControls
        zoom={zoom}
        onZoomIn={() => editorInstance?.zoomIn()}
        onZoomOut={() => editorInstance?.zoomOut()}
        onResetZoom={() => editorInstance?.resetZoom()}
      />

      <div className="absolute inset-0 z-0">
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  );
}
