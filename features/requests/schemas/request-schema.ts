import { z } from "zod";
import { REQUEST_PRIORITIES } from "@/lib/constants/priorities";

export const createRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(2000).optional().or(z.literal("")),
  priority: z.enum(REQUEST_PRIORITIES).default("normal"),
  destination: z.string().max(200).optional().or(z.literal("")),
  neededBy: z.string().optional().or(z.literal("")),
});

export type CreateRequestFormValues = z.infer<typeof createRequestSchema>;
