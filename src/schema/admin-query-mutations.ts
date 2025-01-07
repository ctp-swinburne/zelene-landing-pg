// ~/schema/admin-query-mutations.ts
import { z } from "zod";

export const QueryResponseSchema = z.object({
  response: z.string().nullable(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CANCELLED"]),
});

export type QueryResponseInput = z.infer<typeof QueryResponseSchema>;
