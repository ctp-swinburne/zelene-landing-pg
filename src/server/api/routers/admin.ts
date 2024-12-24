import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { adminProcedure, tenantAdminProcedure } from "../middlewares/auth";
import { TRPCError } from "@trpc/server";
import { UserRole } from "~/types/role";
import bcrypt from "bcryptjs";

export const adminRouter = createTRPCRouter({
  
  getAdminData: adminProcedure.query(() => {
    return {
      message: "You have access to the admin !",
      timestamp: new Date(),
    };
  }),


  listAdmins: tenantAdminProcedure.query(async ({ ctx }) => {
    const admins = await ctx.db.user.findMany({
      where: {
        role: UserRole.ADMIN,
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
    .input(
      z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
      })
    )
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
          role: UserRole.ADMIN,
        },
      });

      return { success: true, user };
    }),

  removeAdmin: tenantAdminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user || user.role !== UserRole.ADMIN) {
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
}); 