import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  becomeInstructorSchema,
  updateProfileSchema,
} from "../validators/user.validator.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/me", requireAuth, userController.getMe);
router.patch(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  userController.updateMe
);
router.post(
  "/become-instructor",
  requireAuth,
  validate(becomeInstructorSchema),
  userController.becomeInstructor
);
router.get("/:id", userController.getInstructorPublic);

export default router;