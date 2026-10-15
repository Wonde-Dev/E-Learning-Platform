import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as courseService from "../services/course.service.js";

export const list = asyncHandler(async (req, res) => {
  const data = await courseService.listCourses(req.query);
  res.json(new ApiResponse(200, data));
});

export const detail = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug);
  res.json(new ApiResponse(200, course));
});

export const create = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, course, "Course created"));
});

export const update = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body, req.user);
  res.json(new ApiResponse(200, course, "Course updated"));
});

export const remove = asyncHandler(async (req, res) => {
  const result = await courseService.deleteCourse(req.params.id, req.user);
  res.json(new ApiResponse(200, result, "Course deleted"));
});

export const myCourses = asyncHandler(async (req, res) => {
  const data = await courseService.listCourses({
    ...req.query,
    instructor: req.user._id,
    status: req.query.status || undefined,
  });
  res.json(new ApiResponse(200, data));
});