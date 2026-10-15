import { Review } from "../models/Review.js";
import { Enrollment } from "../models/Enrollment.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const listForCourse = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate("user", "firstName lastName imageUrl")
    .sort("-createdAt");
  res.json(new ApiResponse(200, reviews));
});

export const create = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const enrolled = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (!enrolled) throw new ApiError(403, "You must be enrolled to review");

  const existing = await Review.findOne({ user: req.user._id, course: courseId });
  if (existing) throw new ApiError(400, "You already reviewed this course");

  const review = await Review.create({
    user: req.user._id,
    course: courseId,
    ...req.body,
  });
  res.status(201).json(new ApiResponse(201, review, "Review created"));
});

export const update = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw new ApiError(404, "Review not found");
  Object.assign(review, req.body);
  await review.save();
  res.json(new ApiResponse(200, review, "Review updated"));
});

export const remove = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!review) throw new ApiError(404, "Review not found");
  res.json(new ApiResponse(200, null, "Review deleted"));
});