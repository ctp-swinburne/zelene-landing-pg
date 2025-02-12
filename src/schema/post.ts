import { z } from "zod";

// Schema for creating a new post
export const postCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([]),
  relatedPosts: z.array(z.number()).optional(),
  isOfficial: z.boolean().optional().default(false),
});

// Schema for updating an existing post
export const postUpdateSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  relatedPosts: z.array(z.number()).optional(),
  isOfficial: z.boolean().optional(),
});

// Schema for querying a single post
export const postQuerySchema = z.object({
  id: z.number(),
});

// Schema for listing posts with filters
export const postListQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.number().nullable().optional(),
  tags: z.array(z.string()).optional(),
  isOfficial: z.boolean().optional(),
  orderBy: z.enum(['latest', 'popular', 'official']).optional().default('latest'),
});

// Schema for post response
export const postResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  viewCount: z.number(),
  likeCount: z.number(),
  commentCount: z.number(),
  isOfficial: z.boolean(),
  tags: z.array(z.object({
    tag: z.object({
      id: z.number(),
      name: z.string(),
      isOfficial: z.boolean(),
    }),
  })),
  createdBy: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  relatedTo: z.array(z.object({
    relatedPost: z.object({
      id: z.number(),
      title: z.string(),
      tags: z.array(z.object({
        tag: z.object({
          id: z.number(),
          name: z.string(),
          isOfficial: z.boolean(),
        }),
      })),
    }),
  })),
});

// Type exports
export type PostCreate = z.infer<typeof postCreateSchema>;
export type PostUpdate = z.infer<typeof postUpdateSchema>;
export type PostQuery = z.infer<typeof postQuerySchema>;
export type PostListQuery = z.infer<typeof postListQuerySchema>;
export type PostResponse = z.infer<typeof postResponseSchema>;