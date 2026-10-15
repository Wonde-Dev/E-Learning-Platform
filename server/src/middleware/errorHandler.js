import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * errorHandler — centralised Express error handler.
 * Must be the LAST middleware: app.use(errorHandler).
 */
export const errorHandler = (err, req, res, next) => {
  // Already-an ApiError
  if (err instanceof ApiError) {
    logger.error(
      `[${err.statusCode}] ${req.method} ${req.originalUrl} — ${err.message}`
    );

    return res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
      errors: err.errors,
      data: null,
    });
  }

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation failed",
      errors,
      data: null,
    });
  }

  // Mongoose cast / duplicate key
  if (err?.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Invalid resource identifier",
      data: null,
    });
  }
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      status: 409,
      message: `${field} already exists`,
      data: null,
    });
  }

  // Something unexpected
  logger.error(`[500] ${req.method} ${req.originalUrl} — ${err?.message || err}`);
  res.status(500).json({
    success: false,
    status: 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err?.message || "Internal server error",
    data: null,
  });
};

export default errorHandler;
