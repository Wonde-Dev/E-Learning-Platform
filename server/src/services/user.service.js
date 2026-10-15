import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const updateProfile = (userId, updates) =>
  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

export const promoteToInstructor = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "instructor") throw new ApiError(400, "Already an instructor");
  user.role = "instructor";
  await user.save();
  return user;
};