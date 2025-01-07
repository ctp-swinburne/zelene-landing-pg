import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  updateProfileInputSchema,
  userResponseSchema,
  profileIdSchema,
  type UserResponse,
} from "~/schema/profile";

export const profileRouter = createTRPCRouter({
  // Public procedures

  getProfile: publicProcedure
    .input(profileIdSchema)
    .output(userResponseSchema)
    .query(async ({ ctx, input }): Promise<UserResponse> => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          image: true,
          joined: true,
          profile: true,
          social: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      // Ensure the returned data matches the schema
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        profile: user.profile,
        social: user.social,
        image: user.image,
        joined: user.joined,
      };
    }),

  // Protected procedures
  getCurrentProfile: protectedProcedure
    .output(userResponseSchema)
    .query(async ({ ctx }): Promise<UserResponse> => {
      const userId = ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          image: true,
          joined: true,
          profile: true,
          social: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        profile: user.profile,
        social: user.social,
        image: user.image,
        joined: user.joined,
      };
    }),

  updateProfile: protectedProcedure
    .input(updateProfileInputSchema)
    .output(userResponseSchema)
    .mutation(async ({ ctx, input }): Promise<UserResponse> => {
      const userId = ctx.session.user.id;

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
          ...input.user,
          profile: input.profile
            ? {
                upsert: {
                  create: input.profile,
                  update: input.profile,
                },
              }
            : undefined,
          social: input.social
            ? {
                upsert: {
                  create: input.social,
                  update: input.social,
                },
              }
            : undefined,
        },
        include: {
          profile: true,
          social: true,
        },
      });

      // Ensure the returned data matches the schema
      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.name,
        profile: updatedUser.profile,
        social: updatedUser.social,
        image: updatedUser.image,
        joined: updatedUser.joined,
      };
    }),
});
