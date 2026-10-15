import { z } from "zod";

const LessonSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Lesson title required"),
  duration: z.number().min(0).default(0),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isPreview: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

const SectionSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Section title required"),
  order: z.number().int().min(0).default(0),
  lessons: z.array(LessonSchema).default([]),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().max(300).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "all-levels"]),
  price: z.number().min(0).default(0),
  discountPrice: z.number().min(0).default(0),
  currency: z.string().length(3).default("USD"),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  whatYouWillLearn: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  sections: z.array(SectionSchema).optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
});

export const updateCourseSchema = createCourseSchema.partial();
