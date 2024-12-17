import { createTRPCRouter, publicProcedure } from "../trpc";
import { registerSchema } from "~/lib/validations/register";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { verifyCaptcha } from "~/lib/captcha";
import { UserRole } from "~/types/role";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { username, password, name, image, email, captchaToken } = input;
      
      // Verify captcha
      const captchaResult = await verifyCaptcha(captchaToken);
      if (!captchaResult.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid captcha",
        });
      }

      const existingUser = await ctx.db.user.findFirst({
        where: { OR: [{ username },{email}] },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username or email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ctx.db.user.create({
        data: {
          username, 
          email,
          password: hashedPassword,
          name,
          image,
          role: UserRole.MEMBER,
        },
      });

      return { success: true, user };
    }),
}); 