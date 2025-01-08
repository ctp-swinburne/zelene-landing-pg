// ~/server/api/routers/post.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  postCreateSchema,
  postUpdateSchema,
  postQuerySchema,
  postListQuerySchema,
} from "~/schema/post";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  // Create a new post
  create: protectedProcedure
    .input(postCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // Use a transaction to create post and relationships
      const post = await ctx.db.$transaction(async (tx) => {
        // First create the post
        const newPost = await tx.post.create({
          data: {
            title: input.title,
            excerpt: input.excerpt,
            content: input.content,
            createdById: ctx.session.user.id,
            ...(input.tags && {
              tags: {
                createMany: {
                  data: input.tags.map((tagId) => ({
                    tagId,
                  })),
                },
              },
            }),
          },
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        // Then create related posts if any
        if (input.relatedPosts?.length) {
          await tx.relatedPosts.createMany({
            data: input.relatedPosts.map((relatedPostId) => ({
              postId: newPost.id,
              relatedPostId,
            })),
          });
        }

        // Return the post with updated relationships
        return tx.post.findUnique({
          where: { id: newPost.id },
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            relatedTo: {
              include: {
                relatedPost: true,
              },
            },
          },
        });
      });

      return post;
    }),

  // Get a single post
  getById: publicProcedure
    .input(postQuerySchema)
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          relatedTo: {
            include: {
              relatedPost: {
                include: {
                  tags: {
                    include: {
                      tag: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Increment view count
      await ctx.db.post.update({
        where: { id: input.id },
        data: { viewCount: { increment: 1 } },
      });

      return post;
    }),

  // Get paginated posts
  getAll: publicProcedure
    .input(postListQuerySchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit + 1;

      const posts = await ctx.db.post.findMany({
        take: limit,
        ...(input.cursor && {
          skip: 1,
          cursor: {
            id: input.cursor,
          },
        }),
        where: input.tags
          ? {
              tags: {
                some: {
                  tagId: {
                    in: input.tags,
                  },
                },
              },
            }
          : undefined,
        orderBy: {
          publishedAt: "desc",
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: posts,
        nextCursor,
      };
    }),

  update: protectedProcedure
    .input(postUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        select: { createdById: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (post.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this post",
        });
      }

      // First, delete existing relationships if new ones are provided
      if (input.tags) {
        await ctx.db.tagsOnPosts.deleteMany({
          where: { postId: input.id },
        });
      }

      if (input.relatedPosts) {
        await ctx.db.relatedPosts.deleteMany({
          where: { postId: input.id },
        });
      }

      const updatedPost = await ctx.db.post.update({
        where: { id: input.id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.excerpt && { excerpt: input.excerpt }),
          ...(input.content && { content: input.content }),
          ...(input.tags && {
            tags: {
              createMany: {
                data: input.tags.map((tagId) => ({
                  tagId,
                })),
              },
            },
          }),
          ...(input.relatedPosts && {
            relatedTo: {
              create: input.relatedPosts.map((relatedPostId) => ({
                post: {
                  connect: {
                    id: input.id,
                  },
                },
                relatedPost: {
                  connect: {
                    id: relatedPostId,
                  },
                },
              })),
            },
          }),
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return updatedPost;
    }),
  // Delete a post
  delete: protectedProcedure
    .input(postQuerySchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        select: { createdById: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (post.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to delete this post",
        });
      }

      await ctx.db.post.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
