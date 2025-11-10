import { z } from 'zod';



/**
 * Schema for validating new note creation.
 * Requires a title and content.
 */
export const noteCreateSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string().min(1, 'content is required'),
});




/**
 * Schema for validating note updates.
 * Requires a title and content.
 * (Note: You might want to add .optional() here if you allow partial updates)
 */
export const noteUpdateSchema = z.object({
  title: z.string().min(1, 'title is required'),
  content: z.string().min(1, 'content is required'),
});