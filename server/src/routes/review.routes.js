import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator.js";
import * as reviewController from "../controllers/review.controller.js";

const router = Router();

router.get("/course/:courseId", reviewController.listForCourse);
router.post(
  "/course/:courseId",
  requireAuth,
  validate(createReviewSchema),
  reviewController.create
);
router.patch(
  "/:id",
  requireAuth,
  validate(updateReviewSchema),
  reviewController.update
);
router.delete("/:id", requireAuth, reviewController.remove);

export default router;