import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 2000, default: "" },
  },
  { timestamps: true }
);

/**
 * One review per user per course
 */
ReviewSchema.index({ user: 1, course: 1 }, { unique: true });

export const Review = mongoose.model("Review", ReviewSchema);
