import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import {
  ContactQuerySchema,
  FeedbackSchema,
  SupportRequestSchema,
  TechnicalIssueWithFilesSchema,
} from "~/schema/queries";
import { uploadToSupabase } from "~/utils/supabase";

export const queryRouter = createTRPCRouter({
  submitContact: publicProcedure
    .input(ContactQuerySchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true }> => {
      try {
        await ctx.db.contactQuery.create({
          data: {
            name: input.name,
            organization: input.organization,
            email: input.email,
            phone: input.phone,
            inquiryType: input.inquiryType,
            message: input.message,
            status: "NEW",
          },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit contact form",
        });
      }
    }),

  submitFeedback: publicProcedure
    .input(FeedbackSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true }> => {
      try {
        await ctx.db.feedback.create({
          data: {
            category: input.category,
            satisfaction: input.satisfaction,
            usability: input.usability,
            features: input.features,
            improvements: input.improvements,
            recommendation: input.recommendation,
            comments: input.comments,
            status: "NEW",
          },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit feedback",
        });
      }
    }),

  submitSupportRequest: publicProcedure
    .input(SupportRequestSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true }> => {
      try {
        await ctx.db.supportRequest.create({
          data: {
            category: input.category,
            subject: input.subject,
            description: input.description,
            priority: input.priority,
            status: "NEW",
          },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit support request",
        });
      }
    }),

  submitTechnicalIssue: publicProcedure
    .input(TechnicalIssueWithFilesSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { attachments, ...issueData } = input;

        // Handle file uploads if attachments exist
        const uploadedPaths = attachments
          ? await Promise.all(
              attachments.map((file) => {
                const fileData = {
                  buffer: Buffer.from(file.base64Data, "base64"),
                  filename: file.filename,
                  contentType: file.contentType,
                };
                return uploadToSupabase(fileData);
              }),
            )
          : [];

        // Create technical issue with uploaded file paths
        await ctx.db.technicalIssue.create({
          data: {
            ...issueData,
            attachments: uploadedPaths,
          },
        });

        return { success: true as const };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit technical issue",
        });
      }
    }),
});
