import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Enrollment } from "../models/Enrollment.js";
import mongoose from "mongoose";
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

export const getCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId
    ? { $or: [{ _id: id }, { certificateId: id }] }
    : { certificateId: id };

  const enrollment = await Enrollment.findOne(filter)
    .populate("user", "firstName lastName email imageUrl")
    .populate({
      path: "course",
      select: "title slug thumbnail instructor stats level",
      populate: { path: "instructor", select: "firstName lastName email imageUrl headline" },
    });

  if (!enrollment || !enrollment.certificateIssued) {
    throw new ApiError(404, "Certificate not found or not yet issued");
  }

  res.json(
    new ApiResponse(200, {
      _id: enrollment._id,
      certificateId: enrollment.certificateId,
      issuedAt: enrollment.certificateIssuedAt || enrollment.completedAt || enrollment.updatedAt,
      studentName:
        (enrollment.user
          ? `${enrollment.user.firstName || ""} ${enrollment.user.lastName || ""}`.trim() || enrollment.user.email
          : "") || "EduFlow Student",
      studentImage: enrollment.user?.imageUrl || "",
      courseTitle: enrollment.course?.title || "Course",
      courseSlug: enrollment.course?.slug || "",
      courseLevel: enrollment.course?.level || "Beginner",
      instructorName: enrollment.course?.instructor
        ? `${enrollment.course.instructor.firstName || ""} ${enrollment.course.instructor.lastName || ""}`.trim() || "Instructor"
        : "EduFlow Academy",
      note: enrollment.certificateNote || "",
    })
  );
});