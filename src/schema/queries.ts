import { z } from "zod";

// Enum schemas
export const QueryStatusSchema = z.enum([
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CANCELLED",
]);

export const InquiryTypeSchema = z.enum([
  "PARTNERSHIP",
  "SALES",
  "MEDIA",
  "GENERAL",
]);

export const FeedbackCategorySchema = z.enum([
  "UI",
  "FEATURES",
  "PERFORMANCE",
  "DOCUMENTATION",
  "GENERAL",
]);

export const IssueTypeSchema = z.enum([
  "DEVICE",
  "PLATFORM",
  "CONNECTIVITY",
  "SECURITY",
  "OTHER",
]);

export const IssueSeveritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const SupportCategorySchema = z.enum([
  "ACCOUNT",
  "DEVICES",
  "PLATFORM",
  "OTHER",
]);

export const SupportPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Contact form schema
export const ContactQuerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  organization: z.string().min(1, "Organization is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  inquiryType: InquiryTypeSchema,
  message: z.string().min(10, "Message must be at least 10 characters"),
  status: QueryStatusSchema.optional().default("NEW"),
});

// Feedback form schema
export const FeedbackSchema = z.object({
  category: FeedbackCategorySchema,
  satisfaction: z.number().min(0).max(5),
  usability: z.number().min(0).max(5),
  features: z.array(z.string()),
  improvements: z.string().min(10, "Improvement details required"),
  recommendation: z.boolean(),
  comments: z.string().optional(),
  status: QueryStatusSchema.optional().default("NEW"),
});

// Support request schema
export const SupportRequestSchema = z.object({
  category: SupportCategorySchema,
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: SupportPrioritySchema,
  status: QueryStatusSchema.optional().default("NEW"),
});

// Technical issue schema
export const TechnicalIssueSchema = z.object({
  deviceId: z.string().optional(),
  issueType: IssueTypeSchema,
  severity: IssueSeveritySchema,
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stepsToReproduce: z.string().min(10, "Steps must be at least 10 characters"),
  expectedBehavior: z
    .string()
    .min(10, "Expected behavior must be at least 10 characters"),
  attachments: z.array(z.string()).optional(),
  status: QueryStatusSchema.optional().default("NEW"),
});

export const FileUploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
  base64Data: z.string(),
});

export const TechnicalIssueWithFilesSchema = TechnicalIssueSchema.extend({
  attachments: z.array(FileUploadSchema).optional(),
});
// Type exports
export type QueryStatus = z.infer<typeof QueryStatusSchema>;
export type InquiryType = z.infer<typeof InquiryTypeSchema>;
export type FeedbackCategory = z.infer<typeof FeedbackCategorySchema>;
export type IssueType = z.infer<typeof IssueTypeSchema>;
export type IssueSeverity = z.infer<typeof IssueSeveritySchema>;
export type SupportCategory = z.infer<typeof SupportCategorySchema>;
export type SupportPriority = z.infer<typeof SupportPrioritySchema>;

export type ContactQuery = z.infer<typeof ContactQuerySchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
export type SupportRequest = z.infer<typeof SupportRequestSchema>;
export type TechnicalIssue = z.infer<typeof TechnicalIssueSchema>;
