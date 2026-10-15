import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB (videos)
});

export const uploadImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new ApiError(400, "Only images allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});