import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  ContactQuerySchema,
  FeedbackSchema,
  SupportRequestSchema,
  TechnicalIssueWithFilesSchema,
} from "~/schema/queries";
import { uploadToSupabase } from "~/utils/supabase";
import { sendEmail, generateQueryConfirmationEmail } from "~/utils/email";

export const queryRouter = createTRPCRouter({
  submitContact: publicProcedure
    .input(ContactQuerySchema)
    .mutation(async ({ ctx, input }): Promise<{ success: true; queryId: string }> => {
      try {
        // Get the logged-in user's email
        const user = await ctx.db.user.findFirst({
          where: {
            id: ctx.session?.user?.id,
          },
          select: {
            email: true,
            name: true,
          },
        });

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

        // Send email to user's registered email if they're logged in, otherwise use form email
        const emailTo = user?.email || input.email;
        const userName = user?.name || input.name;

        // Generate and send email
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Contact Query',
          userName
        );

        await sendEmail({
          to: emailTo,
          subject: 'Contact Query Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
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
        // Get the logged-in user's email
        const user = await ctx.db.user.findFirst({
          where: {
            id: ctx.session?.user?.id,
          },
          select: {
            email: true,
            name: true,
          },
        });

        if (!user?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

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
          },
        });

        // Send email notification
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Feedback',
          user.name ?? 'User'
        );

        await sendEmail({
          to: user.email,
          subject: 'Feedback Submission Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
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
        // Get the logged-in user's email
        const user = await ctx.db.user.findFirst({
          where: {
            id: ctx.session?.user?.id,
          },
          select: {
            email: true,
            name: true,
          },
        });

        if (!user?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

        const result = await ctx.db.supportRequest.create({
          data: {
            category: input.category,
            subject: input.subject,
            description: input.description,
            priority: input.priority,
            status: "NEW",
          },
        });

        // Send email notification
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Support Request',
          user.name ?? 'User'
        );

        await sendEmail({
          to: user.email,
          subject: 'Support Request Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
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
        // Get the logged-in user's email
        const user = await ctx.db.user.findFirst({
          where: {
            id: ctx.session?.user?.id,
          },
          select: {
            email: true,
            name: true,
          },
        });

        if (!user?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be logged in",
          });
        }

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
          },
        });

        // Send email notification
        const { html, text } = generateQueryConfirmationEmail(
          result.id,
          'Technical Issue',
          user.name ?? 'User'
        );

        await sendEmail({
          to: user.email,
          subject: 'Technical Issue Report Confirmation',
          html,
          text,
        });

        return { success: true, queryId: result.id };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit technical issue",
        });
      }
    }),
});