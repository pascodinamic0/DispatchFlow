import { z } from "zod";

const userRoles = [
  "admin",
  "dispatcher",
  "procurement",
  "requester",
  "viewer",
] as const;

export const onboardingSchema = z.object({
  organizationName: z.string().min(2, "Enter your organization name"),
  fullName: z.string().min(2, "Enter your full name"),
  role: z.enum(userRoles),
  department: z.string().max(120).optional().or(z.literal("")),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
