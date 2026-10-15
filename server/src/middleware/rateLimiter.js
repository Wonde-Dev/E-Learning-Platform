/**
 * rateLimiter — general API rate-limiter (100 req / 15 min per IP).
 * Usage: app.use("/api", rateLimiter);
 */
import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.js";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // don't limit in test or on internal health checks
    if (process.env.NODE_ENV === "test") return true;
    return false;
  },
  handler: (req, res, next) => {
    logger.warn(`Rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      success: false,
      status: 429,
      message: "Too many requests. Please try again later.",
      data: null,
    });
  },
});
