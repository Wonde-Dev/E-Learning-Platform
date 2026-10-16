import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["free", "pending", "paid", "refunded"],
      default: "free",
    },
    paymentMethod: { type: String, default: "telebirr" },
    paymentReference: { type: String, default: "" },
    paymentPhone: { type: String, default: "" },
    completedLessons: [{ type: String }],
    progressPercent: { type: Number, default: 0 },
    lastLesson: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    completedAt: { type: Date, default: null },
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: String, default: "" },
    certificateIssuedAt: { type: Date, default: null },
    certificateNote: { type: String, default: "" },
  },
  { timestamps: true }
);

/**
 * Ensure unique enrollment per user+course
 */
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model(
  "Enrollment",
  EnrollmentSchema
);
