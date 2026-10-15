import cloudinary from "../config/cloudinary.js";
import { ApiError } from "./ApiError.js";

/**
 * Stream a buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {object} opts  { folder, resourceType, publicId }
 */
export const streamUpload = (buffer, opts = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: opts.folder || "elearning",
        resource_type: opts.resourceType || "auto",
        public_id: opts.publicId,
      },
      (err, result) => {
        if (err) return reject(new ApiError(500, err.message));
        resolve(result);
      }
    );
    stream.end(buffer);
  });

export const destroyAsset = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (e) {
    console.error("Cloudinary destroy failed:", e.message);
  }
};