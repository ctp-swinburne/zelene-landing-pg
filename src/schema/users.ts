import { z } from "zod";

// User Role Schema
export const userRoleSchema = z.enum(["MEMBER", "ADMIN", "TENANT_ADMIN"]);
export type UserRole = z.infer<typeof userRoleSchema>;

// Base User Schema
export const baseUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email(),
  name: z.string(),
  image: z.string().optional(),
  role: userRoleSchema,
  joined: z.date(),
});
export type User = z.infer<typeof baseUserSchema>;

// Registration Input Schema
export const registerInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  image: z.string().optional(),
  captchaToken: z.string(),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

// Admin Creation Input Schema
export const createAdminInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});
export type CreateAdminInput = z.infer<typeof createAdminInputSchema>;

// Admin Removal Input Schema
export const removeAdminInputSchema = z.object({
  userId: z.string(),
});
export type RemoveAdminInput = z.infer<typeof removeAdminInputSchema>;

// User Creation Schema
export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: userRoleSchema,
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

// User Update Schema
export const updateUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: userRoleSchema.optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;