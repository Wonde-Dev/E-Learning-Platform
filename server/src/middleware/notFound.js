import { ApiError } from "../utils/ApiError.js";

/**
 * notFound — 404 catcher. Place AFTER all routes.
 * Usage: app.use(notFound);
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
