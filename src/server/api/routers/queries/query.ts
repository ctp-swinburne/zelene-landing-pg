import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { sendEmail, generateQueryConfirmationEmail } from "~/utils/email";
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
    .mutation(async ({ ctx, input }): Promise<{ success: true; queryId: string }> => {
      try {
        const result = await ctx.db.contactQuery.create({
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

        // Send confirmation email
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Contact Query',
          input.name
        );

        await sendEmail({
          to: input.email,
          subject: 'Contact Query Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
        console.error('Error in submitContact:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit contact form",
        });
      }
    }),

  submitFeedback: publicProcedure
    .input(FeedbackSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true; queryId: string }> => {
      try {
        const result = await ctx.db.feedback.create({
          data: {
            category: input.category,
            satisfaction: input.satisfaction,
            usability: input.usability,
            features: input.features,
            improvements: input.improvements,
            recommendation: input.recommendation,
            comments: input.comments,
            status: "NEW",
            email: input.email,
          },
        });

        // Send confirmation email
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Feedback',
          'Valued User' // Since feedback form might not have name field
        );

        await sendEmail({
          to: input.email,
          subject: 'Feedback Submission Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
        console.error('Error in submitFeedback:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit feedback",
        });
      }
    }),

  submitSupportRequest: publicProcedure
    .input(SupportRequestSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true; queryId: string }> => {
      try {
        const result = await ctx.db.supportRequest.create({
          data: {
            category: input.category,
            subject: input.subject,
            description: input.description,
            priority: input.priority,
            email: input.email,
            status: "NEW",
          },
        });

        // Send confirmation email
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Support Request',
          'User' // You might want to add name field to support request form
        );

        await sendEmail({
          to: input.email,
          subject: 'Support Request Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
        console.error('Error in submitSupportRequest:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit support request",
        });
      }
    }),

  submitTechnicalIssue: publicProcedure
    .input(TechnicalIssueWithFilesSchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true; queryId: string }> => {
      try {
        const { attachments, ...issueData } = input;

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

        const result = await ctx.db.technicalIssue.create({
          data: {
            ...issueData,
            attachments: uploadedPaths,
            email: input.email,
            status: "NEW",
          },
        });

        // Send confirmation email
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Technical Issue',
          'User' // You might want to add name field to technical issue form
        );

        await sendEmail({
          to: input.email,
          subject: 'Technical Issue Report Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
        console.error('Error in submitTechnicalIssue:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit technical issue",
        });
      }
    }),
});