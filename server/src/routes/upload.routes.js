import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { upload, uploadImage } from "../middleware/upload.js";
import * as uploadController from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/thumbnail",
  requireAuth,
  requireRole("instructor", "admin"),
  uploadImage.single("file"),
  uploadController.uploadThumbnail
);

router.post(
  "/video",
  requireAuth,
  requireRole("instructor", "admin"),
  upload.single("file"),
  uploadController.uploadVideo
);

router.post(
  "/avatar",
  requireAuth,
  uploadImage.single("file"),
  uploadController.uploadAvatar
);

router.post(
  "/document",
  requireAuth,
  requireRole("instructor", "admin"),
  upload.single("file"),
  uploadController.uploadDocument
);

router.delete("/", requireAuth, uploadController.deleteAsset);

export default router;