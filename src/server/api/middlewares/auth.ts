import { TRPCError } from "@trpc/server";
import { UserRole } from "~/types/role";
import { t } from "../trpc";

interface AuthMeta {
  allowedRoles: UserRole[];
}

const isAuthorized = (userRole: UserRole, allowedRoles: UserRole[]) => {
  return allowedRoles.includes(userRole);
};

export const enforceUserIsAuthorized = t.middleware(({ ctx, next, meta }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const userRole = ctx.session.user.role as UserRole;
  const allowedRoles = (meta as AuthMeta)?.allowedRoles;

  if (!allowedRoles || !isAuthorized(userRole, allowedRoles)) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = t.procedure
  .use(enforceUserIsAuthorized)
  .meta({ allowedRoles: [UserRole.ADMIN, UserRole.TENANT_ADMIN] });

export const tenantAdminProcedure = t.procedure
  .use(enforceUserIsAuthorized)
  .meta({ allowedRoles: [UserRole.TENANT_ADMIN] });