import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  enrollSchema,
  progressSchema,
} from "../validators/enrollment.validator.js";
import * as enrollmentController from "../controllers/enrollment.controller.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(enrollSchema),
  enrollmentController.enroll
);

router.get("/me", requireAuth, enrollmentController.myEnrollments);

router.get("/:courseId", requireAuth, enrollmentController.getOne);

router.patch(
  "/:courseId/progress",
  requireAuth,
  validate(progressSchema),
  enrollmentController.progress
);

export default router;