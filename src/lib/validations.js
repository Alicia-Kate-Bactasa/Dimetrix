import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(["power_outage", "exploded_transformer", "scheduled_brownout", "voltage_fluctuation", "fallen_pole", "other"]),
  status: z.enum(["active", "ongoing", "scheduled", "restored"]).default("active"),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  area: z.string().min(1, "Area is required"),
  barangay: z.string().optional().nullable(),
  provider: z.string().optional().nullable(),
  sourceType: z.enum(["community", "official"]).default("community"),
  verificationStatus: z.enum(["unverified", "verified", "official"]).default("unverified"),
  sourceUrl: z.string().url().optional().nullable().or(z.literal("")),
  reporterName: z.string().optional().nullable(),
  affectedHouseholds: z.number().int().min(0).optional().nullable(),
  verified: z.boolean().default(false),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  startTime: z.string().datetime().optional(),
});

export const updateIncidentSchema = createIncidentSchema.partial().extend({
  confirmationsCount: z.number().int().min(0).optional(),
  flagCount: z.number().int().min(0).optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100).optional(),
  email: z.string().email("Invalid email address").optional(),
});
