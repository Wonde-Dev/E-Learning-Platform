import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as userService from "../services/user.service.js";

export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, "User fetched"));
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.json(new ApiResponse(200, user, "Profile updated"));
});

export const becomeInstructor = asyncHandler(async (req, res) => {
  const { headline, bio } = req.body;
  const user = await userService.updateProfile(req.user._id, { headline, bio });
  const promoted = await userService.promoteToInstructor(user._id);
  res.json(new ApiResponse(200, promoted, "You are now an instructor"));
});

export const getInstructorPublic = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(
    new ApiResponse(200, {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      headline: user.headline,
      bio: user.bio,
      socials: user.socials,
    })
  );
});