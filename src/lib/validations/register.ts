import { z } from "zod"

export const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot be longer than 20 characters"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  email: z.string()
    .email("Email is not valid"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  image: z.string().optional(),
  captchaToken: z.string().optional()
})

export type RegisterInput = z.infer<typeof registerSchema>; 