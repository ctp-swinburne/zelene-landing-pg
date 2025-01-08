// ~/schema/post.ts
import { z } from "zod";

export const postCreateSchema = z.object({
  title: z.string().min(1).max(255),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.number()).optional(),
  relatedPosts: z.array(z.number()).optional(),
});

export const postUpdateSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.number()).optional(),
  relatedPosts: z.array(z.number()).optional(),
});

export const postQuerySchema = z.object({
  id: z.number(),
});

export const postListQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.number().nullable().optional(),
  tags: z.array(z.number()).optional(),
});
