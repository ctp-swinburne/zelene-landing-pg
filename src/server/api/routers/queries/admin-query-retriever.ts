import { createTRPCRouter } from "~/server/api/trpc";
import { adminProcedure } from "../../middlewares/auth";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPublicUrl } from "~/utils/supabase";

const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]).optional(),
});

const StatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]).optional(),
});
interface QueryCounts {
  contacts: number;
  feedback: number;
  supportRequests: number;
  technicalIssues: number;
}

export const adminQueryRouter = createTRPCRouter({
  getContacts: adminProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.contactQuery.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.contactQuery.count({ where }),
      ]);

      return {
        items,
        totalPages: Math.ceil(count / input.limit),
        currentPage: input.page,
      };
    }),

  getFeedback: adminProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.feedback.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            category: true,
            satisfaction: true,
            usability: true,
            features: true,
            improvements: true,
            recommendation: true,
            status: true,
            createdAt: true,
          },
        }),
        ctx.db.feedback.count({ where }),
      ]);

      return {
        items,
        totalPages: Math.ceil(count / input.limit),
        currentPage: input.page,
      };
    }),

  getSupportRequests: adminProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.supportRequest.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        }),
        ctx.db.supportRequest.count({ where }),
      ]);

      return {
        items,
        totalPages: Math.ceil(count / input.limit),
        currentPage: input.page,
      };
    }),

  getTechnicalIssues: adminProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.technicalIssue.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
        }),
        ctx.db.technicalIssue.count({ where }),
      ]);

      // Get signed URLs for attachments
      const itemsWithSignedUrls = await Promise.all(
        items.map(async (issue) => ({
          ...issue,
          attachments: await Promise.all(
            issue.attachments.map((path) => getPublicUrl(path)),
          ),
        })),
      );

      return {
        items: itemsWithSignedUrls,
        totalPages: Math.ceil(count / input.limit),
        currentPage: input.page,
      };
    }),
  getQueryCounts: adminProcedure
    .input(StatusSchema)
    .query(async ({ ctx, input }): Promise<QueryCounts> => {
      const where = input.status ? { status: input.status } : {};

      const [
        contactCount,
        feedbackCount,
        supportRequestCount,
        technicalIssueCount,
      ] = await Promise.all([
        ctx.db.contactQuery.count({ where }),
        ctx.db.feedback.count({ where }),
        ctx.db.supportRequest.count({ where }),
        ctx.db.technicalIssue.count({ where }),
      ]);

      return {
        contacts: contactCount,
        feedback: feedbackCount,
        supportRequests: supportRequestCount,
        technicalIssues: technicalIssueCount,
      };
    }),
});
