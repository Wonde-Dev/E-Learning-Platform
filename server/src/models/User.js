import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const SocialSchema = new mongoose.Schema(
  {
    website: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    socials: { type: SocialSchema, default: () => ({}) },
  },
  { timestamps: true }
);

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export const User = mongoose.model("User", UserSchema);
