import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: {
      type: String,
      unique: true,
      index: true,
      set: (v, doc) => {
        if (v) return v;
        const name = doc?.name || doc?.getName?.() || "";
        return slugify(name);
      },
    },
    icon: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strictQuery: false }
);

CategorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

export const Category = mongoose.model("Category", CategorySchema);
