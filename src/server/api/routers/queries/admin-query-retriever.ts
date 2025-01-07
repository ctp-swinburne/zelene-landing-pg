// ~/server/api/routers/queries/admin-query-retriever.ts
import { createTRPCRouter } from "~/server/api/trpc";
import { adminProcedure } from "../../middlewares/auth";
import { getPublicUrl } from "~/utils/supabase";
import {
  PaginationSchema,
  StatusSchema,
  PaginatedResponseSchema,
  ContactQuerySchema,
  FeedbackSchema,
  SupportRequestSchema,
  TechnicalIssueSchema,
  QueryCountsSchema,
  type QueryCounts,
} from "~/schema/admin-query-schema";

export const adminQueryRouter = createTRPCRouter({
  getContacts: adminProcedure
    .input(PaginationSchema)
    .output(PaginatedResponseSchema(ContactQuerySchema))
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.contactQuery.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            name: true,
            organization: true,
            email: true,
            phone: true,
            inquiryType: true,
            message: true,
            status: true,
            response: true, // Added response field
          },
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
    .output(PaginatedResponseSchema(FeedbackSchema))
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
            response: true, // Added response field
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
    .output(PaginatedResponseSchema(SupportRequestSchema))
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.supportRequest.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            category: true,
            subject: true,
            description: true,
            priority: true,
            status: true,
            response: true, // Added response field
          },
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
    .output(PaginatedResponseSchema(TechnicalIssueSchema))
    .query(async ({ ctx, input }) => {
      const where = input.status ? { status: input.status } : {};
      const [items, count] = await Promise.all([
        ctx.db.technicalIssue.findMany({
          where,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deviceId: true,
            issueType: true,
            severity: true,
            title: true,
            description: true,
            stepsToReproduce: true,
            expectedBehavior: true,
            attachments: true,
            status: true,
            response: true, // Added response field
          },
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
    .output(QueryCountsSchema)
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
