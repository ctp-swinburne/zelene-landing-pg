import { createTRPCRouter, publicProcedure } from "../../trpc";
import { registerInputSchema, userRoleSchema } from "~/schema/users";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { verifyCaptcha } from "~/lib/captcha";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerInputSchema)
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
        where: { OR: [{ username }, { email }] },
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
          role: userRoleSchema.enum.MEMBER,
        },
      });

      return { success: true, user };
    }),
});
