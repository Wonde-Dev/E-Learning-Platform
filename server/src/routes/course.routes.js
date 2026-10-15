import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.validator.js";
import * as courseController from "../controllers/course.controller.js";

const router = Router();

// Public
router.get("/", courseController.list);
router.get("/:slug", courseController.detail);

// Instructor
router.get(
  "/instructor/mine",
  requireAuth,
  requireRole("instructor", "admin"),
  courseController.myCourses
);

router.post(
  "/",
  requireAuth,
  requireRole("instructor", "admin"),
  validate(createCourseSchema),
  courseController.create
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("instructor", "admin"),
  validate(updateCourseSchema),
  courseController.update
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("instructor", "admin"),
  courseController.remove
);

export default router;