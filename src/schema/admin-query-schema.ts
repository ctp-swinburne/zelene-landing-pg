import { z } from "zod";

// Input Schemas
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]).optional(),
});

export const StatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]).optional(),
});

// Generic paginated response schema
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    totalPages: z.number(),
    currentPage: z.number(),
  });

// Model Schemas
export const ContactQuerySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  organization: z.string(),
  email: z.string(),
  phone: z.string(),
  inquiryType: z.enum(["PARTNERSHIP", "SALES", "MEDIA", "GENERAL"]),
  message: z.string(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]),
});

export const FeedbackSchema = z.object({
  id: z.string(),
  category: z.enum([
    "UI",
    "FEATURES",
    "PERFORMANCE",
    "DOCUMENTATION",
    "GENERAL",
  ]),
  satisfaction: z.number(),
  usability: z.number(),
  features: z.array(z.string()),
  improvements: z.string(),
  recommendation: z.boolean(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]),
  createdAt: z.date(),
});

export const SupportRequestSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  category: z.enum(["ACCOUNT", "DEVICES", "PLATFORM", "OTHER"]),
  subject: z.string(),
  description: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]),
});

export const TechnicalIssueSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deviceId: z.string().nullable(),
  issueType: z.enum([
    "DEVICE",
    "PLATFORM",
    "CONNECTIVITY",
    "SECURITY",
    "OTHER",
  ]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  title: z.string(),
  description: z.string(),
  stepsToReproduce: z.string(),
  expectedBehavior: z.string(),
  attachments: z.array(z.string()),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]),
});

export const QueryCountsSchema = z.object({
  contacts: z.number(),
  feedback: z.number(),
  supportRequests: z.number(),
  technicalIssues: z.number(),
});

// Export types
export type QueryCounts = z.infer<typeof QueryCountsSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type StatusInput = z.infer<typeof StatusSchema>;
