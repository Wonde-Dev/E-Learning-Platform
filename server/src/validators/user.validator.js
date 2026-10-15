import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName: z.string().min(1).max(60).optional(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(120).optional(),
  imageUrl: z.string().url().optional(),
  socials: z
    .object({
      website: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      youtube: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
});

export const becomeInstructorSchema = z.object({
  headline: z.string().min(4).max(120),
  bio: z.string().min(20).max(500),
});