import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

const cfg = env.CLOUDINARY;

if (cfg.cloudName && cfg.apiKey && cfg.apiSecret) {
  cloudinary.config({
    cloud_name: cfg.cloudName,
    api_key: cfg.apiKey,
    api_secret: cfg.apiSecret,
  });
  logger.info("Cloudinary configured");
} else {
  logger.warn("Cloudinary credentials missing — uploads will fail");
}

export default cloudinary;
