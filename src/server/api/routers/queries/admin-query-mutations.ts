// ~/server/api/routers/queries/admin-query-mutations.ts
import { createTRPCRouter } from "~/server/api/trpc";
import { adminProcedure } from "../../middlewares/auth";
import { QueryResponseSchema } from "~/schema/admin-query-mutations";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const adminQueryMutationsRouter = createTRPCRouter({
  updateContactQuery: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ...QueryResponseSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.db.contactQuery.findUnique({
        where: { id: input.id },
      });

      if (!contact) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contact query not found",
        });
      }

      return ctx.db.contactQuery.update({
        where: { id: input.id },
        data: {
          status: input.status,
          response: input.response,
        },
      });
    }),

  updateFeedback: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ...QueryResponseSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const feedback = await ctx.db.feedback.findUnique({
        where: { id: input.id },
      });

      if (!feedback) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feedback not found",
        });
      }

      return ctx.db.feedback.update({
        where: { id: input.id },
        data: {
          status: input.status,
          response: input.response,
        },
      });
    }),

  updateSupportRequest: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ...QueryResponseSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.supportRequest.findUnique({
        where: { id: input.id },
      });

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Support request not found",
        });
      }

      return ctx.db.supportRequest.update({
        where: { id: input.id },
        data: {
          status: input.status,
          response: input.response,
        },
      });
    }),

  updateTechnicalIssue: adminProcedure
    .input(
      z.object({
        id: z.string(),
        ...QueryResponseSchema.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const issue = await ctx.db.technicalIssue.findUnique({
        where: { id: input.id },
      });

      if (!issue) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Technical issue not found",
        });
      }

      return ctx.db.technicalIssue.update({
        where: { id: input.id },
        data: {
          status: input.status,
          response: input.response,
        },
      });
    }),
});
