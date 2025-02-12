// ~/server/api/routers/post/post.ts
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
      const canCreateOfficialContent = 
        ctx.session.user.role === "ADMIN" || 
        ctx.session.user.role === "TENANT_ADMIN";

      // Use a transaction to create post and handle tags
      return await ctx.db.$transaction(async (tx) => {
        // Process tags
        const tags = await Promise.all(
          input.tags.map(async (tagName) => {
            const isOfficialTag = tagName.toLowerCase().includes('official');
            
            if (isOfficialTag && !canCreateOfficialContent) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: "Only administrators can create official tags",
              });
            }

            return tx.tag.upsert({
              where: { name: tagName.toLowerCase() },
              create: {
                name: tagName.toLowerCase(),
                isOfficial: isOfficialTag && canCreateOfficialContent,
              },
              update: {}, // Don't update existing tags
            });
          })
        );

        // Set post as official if it has any official tags
        const hasOfficialTags = tags.some(tag => tag.isOfficial);

        const post = await tx.post.create({
          data: {
            title: input.title,
            excerpt: input.excerpt,
            content: input.content,
            isOfficial: hasOfficialTags,
            priority: hasOfficialTags ? 1 : 0,
            createdById: ctx.session.user.id,
            tags: {
              create: tags.map(tag => ({
                tag: { connect: { id: tag.id } }
              }))
            },
            ...(input.relatedPosts && {
              relatedTo: {
                create: input.relatedPosts.map(relatedPostId => ({
                  post: {
                    connect: { id: relatedPostId }
                  }
                }))
              }
            })
          },
          include: {
            tags: {
              include: {
                tag: true
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            relatedTo: {
              include: {
                relatedPost: {
                  include: {
                    tags: {
                      include: {
                        tag: true
                      }
                    }
                  }
                }
              }
            }
          }
        });

        return post;
      });
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

  // Get all posts with pagination and filtering
  getAll: publicProcedure
    .input(postListQuerySchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit + 1;

      // Build where clause
      const where = {
        AND: [
          // Filter by tags if provided
          input.tags && input.tags.length > 0
            ? {
                tags: {
                  some: {
                    tag: {
                      name: {
                        in: input.tags.map(tag => tag.toLowerCase()),
                      },
                    },
                  },
                },
              }
            : {},
          // Filter by official status if provided
          input.isOfficial !== undefined
            ? { isOfficial: input.isOfficial }
            : {},
        ],
      };

      // Build order by clause with priority for official posts
      const orderBy = [
        { isOfficial: 'desc' as const },  // Official posts first
        { priority: 'desc' as const },     // Then by priority
        { publishedAt: 'desc' as const }, // Then by date
      ];

      const posts = await ctx.db.post.findMany({
        take: limit,
        ...(input.cursor && {
          skip: 1,
          cursor: {
            id: input.cursor,
          },
        }),
        where,
        orderBy,
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

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: posts,
        nextCursor,
      };
    }),

  // Update a post
  update: protectedProcedure
    .input(postUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const canManageOfficialContent = 
        ctx.session.user.role === "ADMIN" || 
        ctx.session.user.role === "TENANT_ADMIN";

      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        select: { createdById: true, isOfficial: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Only allow creators or admins to update posts
      if (post.createdById !== ctx.session.user.id && !canManageOfficialContent) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this post",
        });
      }

      // Only allow admins to update official posts
      if (post.isOfficial && !canManageOfficialContent) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can update official posts",
        });
      }

      return await ctx.db.$transaction(async (tx) => {
        // Handle tags if they're being updated
        if (input.tags) {
          // Delete existing tags
          await tx.tagsOnPosts.deleteMany({
            where: { postId: input.id },
          });

          // Process new tags
          const tags = await Promise.all(
            input.tags.map(async (tagName) => {
              const isOfficialTag = tagName.toLowerCase().includes('official');
              
              if (isOfficialTag && !canManageOfficialContent) {
                throw new TRPCError({
                  code: "FORBIDDEN",
                  message: "Only administrators can use official tags",
                });
              }

              return tx.tag.upsert({
                where: { name: tagName.toLowerCase() },
                create: {
                  name: tagName.toLowerCase(),
                  isOfficial: isOfficialTag && canManageOfficialContent,
                },
                update: {},
              });
            })
          );

          const hasOfficialTags = tags.some(tag => tag.isOfficial);

          // Update post with new tags
          return tx.post.update({
            where: { id: input.id },
            data: {
              ...(input.title && { title: input.title }),
              ...(input.excerpt && { excerpt: input.excerpt }),
              ...(input.content && { content: input.content }),
              isOfficial: hasOfficialTags,
              priority: hasOfficialTags ? 1 : 0,
              tags: {
                create: tags.map(tag => ({
                  tag: { connect: { id: tag.id } }
                }))
              },
              ...(input.relatedPosts && {
                relatedTo: {
                  deleteMany: {},
                  create: input.relatedPosts.map(relatedPostId => ({
                    post: {
                      connect: { id: relatedPostId }
                    }
                  }))
                }
              })
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
        }

        // Update post without changing tags
        return tx.post.update({
          where: { id: input.id },
          data: {
            ...(input.title && { title: input.title }),
            ...(input.excerpt && { excerpt: input.excerpt }),
            ...(input.content && { content: input.content }),
            ...(input.relatedPosts && {
              relatedTo: {
                deleteMany: {},
                create: input.relatedPosts.map(relatedPostId => ({
                  post: {
                    connect: { id: relatedPostId }
                  }
                }))
              }
            })
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
      });
    }),

  // Delete a post
  delete: protectedProcedure
    .input(postQuerySchema)
    .mutation(async ({ ctx, input }) => {
      const canManageOfficialContent = 
        ctx.session.user.role === "ADMIN" || 
        ctx.session.user.role === "TENANT_ADMIN";

      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        select: { createdById: true, isOfficial: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Only allow creators or admins to delete posts
      if (post.createdById !== ctx.session.user.id && !canManageOfficialContent) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to delete this post",
        });
      }

      // Only allow admins to delete official posts
      if (post.isOfficial && !canManageOfficialContent) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can delete official posts",
        });
      }

      await ctx.db.post.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});