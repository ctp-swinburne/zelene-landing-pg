// ~/server/api/routers/queries/query-lookup.ts
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  ContactQuerySchema,
  FeedbackSchema,
  SupportRequestSchema,
  TechnicalIssueSchema,
} from "~/schema/admin-query-schema";

const QueryIdSchema = z.object({
  id: z.string().min(1, "Query ID is required"),
});

export const queryLookupRouter = createTRPCRouter({
  getQueryById: publicProcedure
    .input(QueryIdSchema)
    .query(async ({ ctx, input }) => {
      // Query all tables in parallel
      const [contact, feedback, support, technical] = await Promise.all([
        ctx.db.contactQuery.findUnique({ where: { id: input.id } }),
        ctx.db.feedback.findUnique({ where: { id: input.id } }),
        ctx.db.supportRequest.findUnique({ where: { id: input.id } }),
        ctx.db.technicalIssue.findUnique({ where: { id: input.id } }),
      ]);

      // Return the first non-null result with its type
      if (contact) return { type: "contact" as const, data: contact };
      if (feedback) return { type: "feedback" as const, data: feedback };
      if (support) return { type: "support" as const, data: support };
      if (technical) return { type: "technical" as const, data: technical };

      return null;
    }),
});
