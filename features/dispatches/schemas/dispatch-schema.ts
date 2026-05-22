import { z } from "zod";
import { DISPATCH_STATUSES } from "@/lib/constants/statuses";

export const createDispatchSchema = z.object({
  requestId: z.preprocess(
    (val) => (typeof val === "string" && val.length > 0 ? val : undefined),
    z.string().uuid().optional(),
  ),
  origin: z.string().max(200).optional().or(z.literal("")),
  destination: z.string().max(200).optional().or(z.literal("")),
  assigneeName: z.string().max(120).optional().or(z.literal("")),
  scheduledAt: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export const updateDispatchStatusSchema = z.object({
  dispatchId: z.string().uuid(),
  status: z.enum(DISPATCH_STATUSES),
  assigneeName: z.string().max(120).optional().or(z.literal("")),
});

export type CreateDispatchFormValues = z.infer<typeof createDispatchSchema>;
