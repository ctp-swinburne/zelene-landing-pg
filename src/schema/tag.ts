import { z } from "zod";

// Schema for tag operations
export const tagSchema = z.object({
  name: z.string()
    .min(1, "Tag name is required")
    .max(50, "Tag name cannot exceed 50 characters")
    .transform(val => val.toLowerCase())
    .refine(val => /^[a-z0-9-]+$/.test(val), {
      message: "Tags can only contain letters, numbers, and hyphens"
    }),
  isOfficial: z.boolean().default(false),
});

// Schema for creating a new tag
export const createTagSchema = tagSchema.extend({});

// Schema for updating an existing tag
export const updateTagSchema = tagSchema.extend({
  id: z.number(),
});

// Schema for querying tags
export const tagQuerySchema = z.object({
  query: z.string().optional(),
  isOfficial: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(10),
  cursor: z.number().nullable().optional(),
});

// Schema for tag search input
export const tagSearchSchema = z.object({
  query: z.string()
    .min(1)
    .transform(val => val.startsWith('#') ? val.slice(1) : val)
    .transform(val => val.toLowerCase()),
});

// Schema for tag response
export const tagResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  isOfficial: z.boolean(),
  postCount: z.number(),
});

// Types
export type TagInput = z.infer<typeof tagSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type TagQuery = z.infer<typeof tagQuerySchema>;
export type TagResponse = z.infer<typeof tagResponseSchema>;