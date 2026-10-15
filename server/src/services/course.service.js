import { Course } from "../models/Course.js";
import { ApiError } from "../utils/ApiError.js";

export const listCourses = async (query = {}) => {
  const {
    q,
    category,
    level,
    price,
    sort = "-createdAt",
    page = 1,
    limit = 12,
    status = "published",
    instructor,
  } = query;

  const filter = { status };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (instructor) filter.instructor = instructor;
  if (price === "free") filter.price = 0;
  if (price === "paid") filter.price = { $gt: 0 };
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Course.find(filter)
      .populate("instructor", "firstName lastName imageUrl headline")
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Course.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({ slug })
    .populate("instructor", "firstName lastName imageUrl headline bio socials")
    .populate("category", "name slug");
  if (!course) throw new ApiError(404, "Course not found");
  return course;
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, "Course not found");
  return course;
};

export const createCourse = (payload, instructorId) =>
  Course.create({ ...payload, instructor: instructorId });

export const updateCourse = async (courseId, updates, user) => {
  const course = await getCourseById(courseId);
  if (user.role !== "admin" && String(course.instructor) !== String(user._id))
    throw new ApiError(403, "Not your course");

  Object.assign(course, updates);
  await course.save();
  return course;
};

export const deleteCourse = async (courseId, user) => {
  const course = await getCourseById(courseId);
  if (user.role !== "admin" && String(course.instructor) !== String(user._id))
    throw new ApiError(403, "Not your course");
  await course.deleteOne();
  return { deleted: true };
};