import { Enrollment } from "../models/Enrollment.js";
import { Course } from "../models/Course.js";
import { ApiError } from "../utils/ApiError.js";

export const enrollFree = async (userId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  if (course.effectivePrice > 0)
    throw new ApiError(400, "This course requires payment");

  let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (enrollment) return enrollment;

  enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    paymentStatus: "free",
  });

  await Course.findByIdAndUpdate(courseId, {
    $inc: { "stats.totalStudents": 1 },
  });

  return enrollment;
};

export const listMyEnrollments = (userId) =>
  Enrollment.find({ user: userId })
    .populate({
      path: "course",
      populate: { path: "instructor", select: "firstName lastName imageUrl" },
    })
    .sort("-updatedAt");

export const getEnrollment = async (userId, courseId) => {
  const e = await Enrollment.findOne({ user: userId, course: courseId }).populate("course");
  if (!e) throw new ApiError(404, "Not enrolled");
  return e;
};

export const toggleLessonProgress = async (userId, courseId, lessonId, completed) => {
  const enrollment = await getEnrollment(userId, courseId);
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const ids = new Set(enrollment.completedLessons.map(String));
  if (completed) ids.add(String(lessonId));
  else ids.delete(String(lessonId));
  enrollment.completedLessons = [...ids];
  enrollment.lastLesson = lessonId;

  const totalLessons = course.stats.totalLessons || 1;
  const pct = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  enrollment.progressPercent = pct;

  if (pct >= 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
    enrollment.certificateIssued = true;
    enrollment.certificateIssuedAt = new Date();
    if (!enrollment.certificateId) {
      enrollment.certificateId = `EDU-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  await enrollment.save();
  return enrollment;
};