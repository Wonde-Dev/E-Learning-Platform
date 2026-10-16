import { z } from "zod";

export const enrollSchema = z.object({
  courseId: z.string().min(1),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  paymentPhone: z.string().optional(),
});

export const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
});