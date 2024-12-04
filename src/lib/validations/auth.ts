import { z } from "zod"

export const loginSchema = z.object({
  username: z.string()
    .min(3, "Username must have at least 3 characters")
    .max(20, "Username cannot be longer than 20 characters"),
  password: z.string()
    .min(6, "Password must have at least 6 characters")
})

export type LoginInput = z.infer<typeof loginSchema> 