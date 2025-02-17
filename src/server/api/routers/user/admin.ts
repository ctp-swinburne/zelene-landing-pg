import { createTRPCRouter } from "../../trpc";
import { adminProcedure, tenantAdminProcedure } from "../../middlewares/auth";
import { TRPCError } from "@trpc/server";
import {
  createAdminInputSchema,
  removeAdminInputSchema,
  userRoleSchema,
  createUserSchema,
  updateUserSchema,
} from "~/schema/users";
import { PaginationSchema } from "~/schema/admin-query-schema";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  // Admin Data Access
  getAdminData: adminProcedure.query(() => {
    return {
      message: "You have access to the admin!",
      timestamp: new Date(),
    };
  }),

  // Admin Management
  listAdmins: tenantAdminProcedure.query(async ({ ctx }) => {
    const admins = await ctx.db.user.findMany({
      where: {
        role: userRoleSchema.enum.ADMIN,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
      },
    });
    return admins;
  }),

  createAdmin: tenantAdminProcedure
    .input(createAdminInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findFirst({
        where: { OR: [{ username: input.username }, { email: input.email }] },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username or email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          ...input,
          password: hashedPassword,
          role: userRoleSchema.enum.ADMIN,
        },
      });

      return { success: true, user };
    }),

  removeAdmin: tenantAdminProcedure
    .input(removeAdminInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user || user.role !== userRoleSchema.enum.ADMIN) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin not found",
        });
      }

      await ctx.db.user.delete({
        where: { id: input.userId },
      });

      return { success: true };
    }),

  // User Management
  listUsers: adminProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      const [users, count] = await Promise.all([
        ctx.db.user.findMany({
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { joined: "desc" },
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            role: true,
            joined: true,
          },
        }),
        ctx.db.user.count(),
      ]);

      return {
        items: users,
        totalPages: Math.ceil(count / input.limit),
        currentPage: input.page,
      };
    }),

  createUser: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Check for existing user
      const existingUser = await ctx.db.user.findFirst({
        where: { OR: [{ username: input.username }, { email: input.email }] },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username or email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Check if non-TENANT_ADMIN tries to create TENANT_ADMIN
      if (
        input.role === "TENANT_ADMIN" &&
        ctx.session.user.role !== "TENANT_ADMIN"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only TENANT_ADMIN can create other TENANT_ADMIN users",
        });
      }

      try {
        // Create user
        const user = await ctx.db.user.create({
          data: {
            ...input,
            password: hashedPassword,
          },
        });

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),

  updateUser: adminProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check if user exists
      const existingUser = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check permissions for TENANT_ADMIN modification
      if (existingUser.role === "TENANT_ADMIN" || data.role === "TENANT_ADMIN") {
        if (ctx.session.user.role !== "TENANT_ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only TENANT_ADMIN can modify TENANT_ADMIN users",
          });
        }
      }

      // Check for email/username conflicts
      if (data.email || data.username) {
        const conflictingUser = await ctx.db.user.findFirst({
          where: {
            OR: [
              data.email ? { email: data.email } : {},
              data.username ? { username: data.username } : {},
            ],
            NOT: {
              id,
            },
          },
        });

        if (conflictingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username or email already exists",
          });
        }
      }

      try {
        // Update user
        const updatedUser = await ctx.db.user.update({
          where: { id },
          data,
        });

        return updatedUser;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user",
        });
      }
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check permissions for TENANT_ADMIN deletion
      if (user.role === "TENANT_ADMIN") {
        if (ctx.session.user.role !== "TENANT_ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only TENANT_ADMIN can delete TENANT_ADMIN users",
          });
        }
      }

      try {
        // Delete user
        await ctx.db.user.delete({
          where: { id: input.userId },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete user",
        });
      }
    }),
});