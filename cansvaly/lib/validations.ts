import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  template: z.enum(['blank', 'flowchart', 'brainstorming', 'wireframe']).default('blank'),
  isPublic: z.boolean().default(false),
});

export const renameBoardSchema = z.object({
  boardId: z.string().min(1, 'Board ID is required'),
  title: z.string().min(1, 'Title is required').max(100),
});

export const inviteCollaboratorSchema = z.object({
  boardId: z.string().min(1, 'Board ID is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['editor', 'viewer', 'commenter']).default('editor'),
});
