import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as enrollmentService from "../services/enrollment.service.js";

export const enroll = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollFree(req.user._id, req.body.courseId);
  res.status(201).json(new ApiResponse(201, enrollment, "Enrolled"));
});

export const myEnrollments = asyncHandler(async (req, res) => {
  const items = await enrollmentService.listMyEnrollments(req.user._id);
  res.json(new ApiResponse(200, items));
});

export const getOne = asyncHandler(async (req, res) => {
  const e = await enrollmentService.getEnrollment(req.user._id, req.params.courseId);
  res.json(new ApiResponse(200, e));
});

export const progress = asyncHandler(async (req, res) => {
  const { lessonId, completed } = req.body;
  const e = await enrollmentService.toggleLessonProgress(
    req.user._id,
    req.params.courseId,
    lessonId,
    completed
  );
  res.json(new ApiResponse(200, e, "Progress updated"));
});