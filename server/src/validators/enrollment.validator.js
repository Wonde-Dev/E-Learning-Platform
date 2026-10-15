import { z } from "zod";

export const enrollSchema = z.object({
  courseId: z.string().min(1),
});

export const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
});