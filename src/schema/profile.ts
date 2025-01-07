import { z } from "zod";

// Base schemas
export const socialSchema = z
  .object({
    website: z.string().url().nullish(),
    twitter: z.string().url().nullish(),
    github: z.string().url().nullish(),
    linkedin: z.string().url().nullish(),
    facebook: z.string().url().nullish(),
  })
  .nullable();

export const profileSchema = z
  .object({
    bio: z.string().max(500).nullable(),
    location: z.string().max(100).nullable(),
    currentLearning: z.string().max(200).nullable(),
    availableFor: z.string().max(200).nullable(),
    skills: z.string().max(200).nullable(),
    currentProject: z.string().max(200).nullable(),
    pronouns: z.boolean().nullable(),
    work: z.string().max(200).nullable(),
    education: z.string().max(200).nullable(),
  })
  .nullable();

export const profileIdSchema = z.object({
  userId: z.string(),
});

export const updateProfileInputSchema = z.object({
  user: z
    .object({
      username: z.string().min(3).max(20).optional(),
      email: z.string().email().optional(),
      name: z.string().min(2).optional(),
    })
    .partial(),
  profile: profileSchema.unwrap().partial(),
  social: socialSchema.unwrap().partial(),
});

// Response schemas
export const userResponseSchema = z.object({
  id: z.string(),
  username: z.string().nullable(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  profile: profileSchema,
  social: socialSchema,
  joined: z.date(),
});

// Type exports
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export type ProfileId = z.infer<typeof profileIdSchema>;
