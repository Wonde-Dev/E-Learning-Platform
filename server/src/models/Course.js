import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";
import "./Category.js";

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: Number, default: 0 },
    videoUrl: { type: String, default: "" },
    isPreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: false }
);

const StatsSchema = new mongoose.Schema(
  {
    totalStudents: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    subtitle: { type: String, maxlength: 300 },
    description: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String }],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all-levels"],
    },
    price: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
    sections: { type: [SectionSchema], default: [] },
    stats: { type: StatsSchema, default: () => ({}) },
    thumbnail: { type: String, default: "" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

CourseSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

CourseSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });

export const Course = mongoose.model("Course", CourseSchema);
