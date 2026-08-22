'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/modalStore';
import { createBoardAction } from '@/app/(dashboard)/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  CanvasGridIcon,
  MagicSparkleIcon,
  BrainstormNodeIcon,
  LockShieldIcon,
  TeamUsersIcon,
} from '@/components/shared/CustomIcons';

interface NewBoardModalProps {
  onBoardCreated?: (title: string, description?: string) => void;
}

const TEMPLATES = [
  { id: 'blank', title: 'Blank Canvas', desc: 'Start with a clean slate', icon: CanvasGridIcon },
  { id: 'brainstorming', title: 'Brainstorm & Mindmap', desc: 'Sticky notes & connection maps', icon: BrainstormNodeIcon },
  { id: 'flowchart', title: 'System Architecture', desc: 'Flowcharts & infrastructure diagrams', icon: MagicSparkleIcon },
];

const ACCENT_COLORS = [
  { id: 'indigo', name: 'Indigo Violet', class: 'bg-[#5b4eff]' },
  { id: 'teal', name: 'Emerald Teal', class: 'bg-[#06d6a0]' },
  { id: 'amber', name: 'Warm Amber', class: 'bg-[#ffd166]' },
  { id: 'rose', name: 'Rose Red', class: 'bg-[#ef476f]' },
  { id: 'lavender', name: 'Soft Lavender', class: 'bg-[#9d8df1]' },
];

export function NewBoardModal({ onBoardCreated }: NewBoardModalProps) {
  const router = useRouter();
  const { isNewBoardOpen, closeNewBoard } = useModalStore();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState('blank');
  const [visibility, setVisibility] = React.useState<'private' | 'workspace' | 'public'>('workspace');
  const [selectedColor, setSelectedColor] = React.useState('indigo');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createBoardAction({
        title: title.trim(),
        description: description.trim() || undefined,
        template: selectedTemplate as any,
        isPublic: visibility === 'public',
      });

      if (res.success && res.boardId) {
        if (onBoardCreated) {
          onBoardCreated(title.trim(), description.trim() || undefined);
        }
        setTitle('');
        setDescription('');
        setSelectedTemplate('blank');
        closeNewBoard();
        router.push(`/board/${res.boardId}`);
      }
    } catch (err) {
      console.error('Failed to create board:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isNewBoardOpen} onOpenChange={(open) => !open && closeNewBoard()}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-border bg-card shadow-2xl">
        {/* Modal Header Banner */}
        <div className="relative bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <CanvasGridIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Create New Board</span>
                <MagicSparkleIcon className="h-4 w-4 text-amber-500" />
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Launch a collaborative real-time whiteboard with customized starting templates and privacy settings.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Starter Template Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Starter Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      if (!title && tmpl.id !== 'blank') {
                        setTitle(tmpl.title);
                      }
                    }}
                    className={`flex flex-col text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                        : 'border-border bg-background hover:bg-accent text-muted-foreground'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-semibold text-foreground truncate">{tmpl.title}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 truncate">{tmpl.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Board Title <span className="text-primary">*</span>
              </label>
              <Input
                placeholder="e.g. System Architecture & Sprint Planning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-sm bg-background border-input focus-visible:ring-primary"
                autoFocus
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Input
                placeholder="e.g. Key feature dependencies and design specs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10 text-sm bg-background border-input focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Board Privacy & Accent */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Access Level</label>
              <div className="flex rounded-md border border-border bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex-1 py-1.5 text-[11px] font-medium rounded flex items-center justify-center gap-1 cursor-pointer ${
                    visibility === 'private' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LockShieldIcon className="h-3.5 w-3.5" />
                  <span>Private</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('workspace')}
                  className={`flex-1 py-1.5 text-[11px] font-medium rounded flex items-center justify-center gap-1 cursor-pointer ${
                    visibility === 'workspace' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TeamUsersIcon className="h-3.5 w-3.5" />
                  <span>Team</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Cover Accent</label>
              <div className="flex items-center gap-1.5 py-1">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={`h-6 w-6 rounded-full ${c.class} transition-transform cursor-pointer ${
                      selectedColor === c.id ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeNewBoard} className="h-9 text-xs font-medium">
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting} className="h-9 text-xs font-semibold gap-1.5 shadow-sm">
              {isSubmitting ? 'Creating Canvas...' : 'Create & Open Board'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
