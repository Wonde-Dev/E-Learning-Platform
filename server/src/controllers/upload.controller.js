import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { streamUpload, destroyAsset } from "../utils/cloudinaryUpload.js";

export const uploadThumbnail = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file provided");
  const result = await streamUpload(req.file.buffer, {
    folder: "elearning/thumbnails",
    resourceType: "image",
  });
  res.json(
    new ApiResponse(201, { url: result.secure_url, publicId: result.public_id })
  );
});

export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file provided");
  const result = await streamUpload(req.file.buffer, {
    folder: "elearning/videos",
    resourceType: "video",
  });
  res.json(
    new ApiResponse(201, {
      url: result.secure_url,
      publicId: result.public_id,
      duration: Math.round(result.duration || 0),
    })
  );
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file provided");
  const result = await streamUpload(req.file.buffer, {
    folder: "elearning/avatars",
    resourceType: "image",
  });
  res.json(
    new ApiResponse(201, { url: result.secure_url, publicId: result.public_id })
  );
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file provided");
  const result = await streamUpload(req.file.buffer, {
    folder: "elearning/documents",
    resourceType: "raw", // Cloudinary uses "raw" for PDFs
  });
  res.json(
    new ApiResponse(201, {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format || "pdf",
      bytes: result.bytes,
    })
  );
});

export const deleteAsset = asyncHandler(async (req, res) => {
  const { publicId, resourceType = "image" } = req.body;
  await destroyAsset(publicId, resourceType);
  res.json(new ApiResponse(200, null, "Asset deleted"));
});