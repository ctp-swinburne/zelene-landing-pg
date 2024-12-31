import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userRoleSchema } from "~/schema/users";
import { t } from "../trpc";

// Define the auth metadata schema using Zod
const authMetaSchema = z.object({
  allowedRoles: z.array(userRoleSchema),
});

type AuthMeta = z.infer<typeof authMetaSchema>;

// Utility function to check authorization
const isAuthorized = (
  userRole: z.infer<typeof userRoleSchema>,
  allowedRoles: z.infer<typeof userRoleSchema>[],
) => {
  return allowedRoles.includes(userRole);
};

// Middleware with proper type checking
export const enforceUserIsAuthorized = t.middleware(({ ctx, next, meta }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }

  // Parse and validate the metadata
  const parsedMeta = authMetaSchema.safeParse(meta);
  if (!parsedMeta.success) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid auth metadata configuration",
    });
  }

  // Parse and validate the user role
  const parsedRole = userRoleSchema.safeParse(ctx.session.user.role);
  if (!parsedRole.success) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid user role",
    });
  }

  const userRole = parsedRole.data;

  if (!isAuthorized(userRole, parsedMeta.data.allowedRoles)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't have permission to perform this action",
    });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          role: userRole, // Now properly typed as UserRole
        },
      },
    },
  });
});

// Procedure helpers with proper typing
export const adminProcedure = t.procedure.use(enforceUserIsAuthorized).meta({
  allowedRoles: [userRoleSchema.enum.ADMIN, userRoleSchema.enum.TENANT_ADMIN],
});

export const tenantAdminProcedure = t.procedure
  .use(enforceUserIsAuthorized)
  .meta({
    allowedRoles: [userRoleSchema.enum.TENANT_ADMIN],
  });
