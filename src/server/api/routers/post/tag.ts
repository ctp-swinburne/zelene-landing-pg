// ~/server/api/routers/tag.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createTagSchema,
  updateTagSchema,
  tagQuerySchema,
  tagSearchSchema,
} from "~/schema/tag";
import { TRPCError } from "@trpc/server";

export const tagRouter = createTRPCRouter({
  // Create a new tag
  create: protectedProcedure
    .input(createTagSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user can create official tags
      const canCreateOfficialTags = 
        ctx.session.user.role === "ADMIN" || 
        ctx.session.user.role === "TENANT_ADMIN";

      if (input.isOfficial && !canCreateOfficialTags) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can create official tags",
        });
      }

      // Check if tag already exists
      const existingTag = await ctx.db.tag.findUnique({
        where: { name: input.name.toLowerCase() },
      });

      if (existingTag) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tag already exists",
        });
      }

      return ctx.db.tag.create({
        data: {
          name: input.name.toLowerCase(),
          isOfficial: input.isOfficial && canCreateOfficialTags,
        },
      });
    }),

  // Get all tags with search and filtering
  getAll: publicProcedure
    .input(tagQuerySchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit + 1;
      const isAdmin = ctx.session?.user?.role === "ADMIN" || 
                     ctx.session?.user?.role === "TENANT_ADMIN";

      // Build where clause
      const where = {
        AND: [
          // Filter by name if query provided
          input.query ? { 
            name: { 
              contains: input.query.toLowerCase() 
            } 
          } : {},
          // Only show official tags to admins
          isAdmin ? {} : { isOfficial: false },
          // Filter by official status if specified
          input.isOfficial !== undefined ? { isOfficial: input.isOfficial } : {},
        ],
      };

      const [tags, count] = await Promise.all([
        ctx.db.tag.findMany({
          take: limit,
          ...(input.cursor && {
            skip: 1,
            cursor: {
              id: input.cursor,
            },
          }),
          where,
          orderBy: [
            { isOfficial: 'desc' },
            { name: 'asc' },
          ],
          include: {
            _count: {
              select: { posts: true },
            },
          },
        }),
        ctx.db.tag.count({ where }),
      ]);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (tags.length > input.limit) {
        const nextItem = tags.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: tags.map(tag => ({
          ...tag,
          postCount: tag._count.posts,
        })),
        nextCursor,
      };
    }),

  // Search tags
  search: publicProcedure
    .input(tagSearchSchema)
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.session?.user?.role === "ADMIN" || 
                     ctx.session?.user?.role === "TENANT_ADMIN";

      // Build where clause
      const where = {
        AND: [
          // Search by name
          {
            name: {
              contains: input.query.toLowerCase(),
            },
          },
          // Only show official tags to admins
          isAdmin ? {} : { isOfficial: false }
        ],
      };

      const tags = await ctx.db.tag.findMany({
        where,
        take: 5,
        orderBy: [
          { isOfficial: 'desc' },
          { name: 'asc' },
        ],
      });

      return tags;
    }),

  // Update tag (admin only)
  update: protectedProcedure
    .input(updateTagSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const canManageTags = 
        ctx.session.user.role === "ADMIN" || 
        ctx.session.user.role === "TENANT_ADMIN";

      if (!canManageTags) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can update tags",
        });
      }

      // Check if tag exists
      const existingTag = await ctx.db.tag.findUnique({
        where: { id: input.id },
      });

      if (!existingTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      // Check for name conflicts if name is being changed
      if (input.name && input.name !== existingTag.name) {
        const nameConflict = await ctx.db.tag.findFirst({
          where: { 
            name: input.name.toLowerCase(),
            NOT: { id: input.id }
          },
        });

        if (nameConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Tag name already exists",
          });
        }
      }

      return ctx.db.tag.update({
        where: { id: input.id },
        data: {
          name: input.name?.toLowerCase(),
          isOfficial: input.isOfficial,
        },
      });
    }),

  // Delete tag (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const canManageTags = 
        ctx.session.user.role === "ADMIN" || 
        ctx.session.user.role === "TENANT_ADMIN";

      if (!canManageTags) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can delete tags",
        });
      }

      const tag = await ctx.db.tag.findUnique({
        where: { id: input.id },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      // Check if tag is in use
      const tagInUse = await ctx.db.tagsOnPosts.findFirst({
        where: { tagId: input.id },
      });

      if (tagInUse) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete tag that is in use",
        });
      }

      return ctx.db.tag.delete({
        where: { id: input.id },
      });
    }),

  // Get tag by id
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const tag = await ctx.db.tag.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { posts: true },
          },
        },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      return {
        ...tag,
        postCount: tag._count.posts,
      };
    }),
});