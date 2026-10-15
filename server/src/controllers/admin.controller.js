import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";

// ── Users ──────────────────────────────────────────────────────────────────
export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q, role } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [
    { firstName: { $regex: q, $options: "i" } },
    { lastName:  { $regex: q, $options: "i" } },
    { email:     { $regex: q, $options: "i" } },
  ];
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(filter).sort("-createdAt").skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "instructor", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }
  // Prevent demoting yourself
  if (String(req.user._id) === req.params.id) {
    throw new ApiError(400, "Cannot change your own role");
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "Role updated"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    throw new ApiError(400, "Cannot delete your own account");
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, { deleted: true }, "User deleted"));
});

// ── Courses ────────────────────────────────────────────────────────────────
export const listAllCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) filter.$or = [
    { title: { $regex: q, $options: "i" } },
  ];
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Course.find(filter)
      .populate("instructor", "firstName lastName email imageUrl")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Course.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }));
});

export const updateCourseStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["draft", "published", "archived"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const course = await Course.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!course) throw new ApiError(404, "Course not found");
  res.json(new ApiResponse(200, course, "Status updated"));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new ApiError(404, "Course not found");
  res.json(new ApiResponse(200, { deleted: true }, "Course deleted"));
});

// ── Stats ──────────────────────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
  ]);
  const instructors = await User.countDocuments({ role: "instructor" });
  const published   = await Course.countDocuments({ status: "published" });

  res.json(new ApiResponse(200, {
    totalUsers,
    totalCourses,
    totalEnrollments,
    instructors,
    publishedCourses: published,
    // Revenue is placeholder — wire to payments when available
    totalRevenue: 0,
  }));
});
