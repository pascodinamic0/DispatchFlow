import { z } from "zod";

export const profileSettingsSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  department: z.string().optional(),
  phone: z.string().optional(),
});

export const organizationSettingsSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
});

export const teamRoleSchema = z.object({
  profileId: z.string().uuid(),
  role: z.enum([
    "admin",
    "dispatcher",
    "procurement",
    "requester",
    "viewer",
  ]),
});
