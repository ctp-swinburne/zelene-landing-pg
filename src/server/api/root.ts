import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/user/auth";
import { adminRouter } from "./routers/user/admin";
import { queryRouter } from "./routers/queries/query";
import { adminQueryRouter } from "./routers/queries/admin-query-retriever";
import { adminQueryMutationsRouter } from "./routers/queries/admin-query-mutations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter,
  queries: queryRouter,
  adminQueryView: adminQueryRouter,
  adminQueryMutations: adminQueryMutationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
