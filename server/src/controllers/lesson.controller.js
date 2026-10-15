import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Lesson controller — manages curriculum lessons within sections.
 * Currently wired through Course model; kept for standalone endpoints.
 */
export const list = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, [], "No lessons"));
});
