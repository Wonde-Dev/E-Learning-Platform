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

// ── Certificates ───────────────────────────────────────────────────────────
export const listCertificates = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, q, status } = req.query;
  const filter = {};
  if (status === "issued") {
    filter.certificateIssued = true;
  } else if (status === "pending") {
    filter.certificateIssued = false;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Enrollment.find(filter)
      .populate("user", "firstName lastName email imageUrl clerkId")
      .populate({
        path: "course",
        select: "title slug thumbnail instructor price currency level",
        populate: { path: "instructor", select: "firstName lastName email imageUrl" },
      })
      .sort("-updatedAt")
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Enrollment.countDocuments(filter),
  ]);

  let resultItems = items;
  if (q) {
    const lower = q.toLowerCase();
    resultItems = items.filter(
      (e) =>
        e.user?.firstName?.toLowerCase().includes(lower) ||
        e.user?.lastName?.toLowerCase().includes(lower) ||
        e.user?.email?.toLowerCase().includes(lower) ||
        e.course?.title?.toLowerCase().includes(lower) ||
        e.certificateId?.toLowerCase().includes(lower)
    );
  }

  res.json(
    new ApiResponse(200, {
      items: resultItems,
      total: q ? resultItems.length : total,
      page: Number(page),
      pages: Math.ceil((q ? resultItems.length : total) / Number(limit)),
    })
  );
});

export const issueCertificate = asyncHandler(async (req, res) => {
  const { enrollmentId, userId, courseId, note } = req.body;
  let enrollment;

  if (enrollmentId) {
    enrollment = await Enrollment.findById(enrollmentId);
  } else if (userId && courseId) {
    enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        paymentStatus: "free",
      });
      await Course.findByIdAndUpdate(courseId, {
        $inc: { "stats.totalStudents": 1 },
      });
    }
  }

  if (!enrollment) {
    throw new ApiError(404, "Enrollment or student record not found");
  }

  if (!enrollment.certificateId) {
    enrollment.certificateId = `EDU-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  enrollment.certificateIssued = true;
  enrollment.certificateIssuedAt = new Date();
  enrollment.progressPercent = 100;
  enrollment.completedAt = enrollment.completedAt || new Date();
  if (note !== undefined) enrollment.certificateNote = note;

  await enrollment.save();

  const populated = await Enrollment.findById(enrollment._id)
    .populate("user", "firstName lastName email imageUrl clerkId")
    .populate({
      path: "course",
      select: "title slug thumbnail instructor level",
      populate: { path: "instructor", select: "firstName lastName email imageUrl" },
    });

  res.json(new ApiResponse(200, populated, "Certificate issued successfully"));
});

export const revokeCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) throw new ApiError(404, "Enrollment not found");

  enrollment.certificateIssued = false;
  enrollment.certificateIssuedAt = null;
  await enrollment.save();

  res.json(new ApiResponse(200, { revoked: true, id }, "Certificate revoked successfully"));
});

// ── Stats ──────────────────────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ certificateIssued: true }),
  ]);
  const instructors = await User.countDocuments({ role: "instructor" });
  const published   = await Course.countDocuments({ status: "published" });

  res.json(new ApiResponse(200, {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    instructors,
    publishedCourses: published,
    totalRevenue: 0,
  }));
});
