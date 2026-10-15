import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Section controller — manages curriculum sections.
 * Currently wired through Course model; kept for standalone endpoints.
 */
export const list = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, [], "No sections"));
});
