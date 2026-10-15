/**
 * Seeds the DB with categories + a demo instructor + demo courses.
 * Run: npm run seed
 */
import { connectDB } from "./config/db.js";
import { Category } from "./models/Category.js";
import { Course } from "./models/Course.js";
import { User } from "./models/User.js";
import mongoose from "mongoose";

const categories = [
  { name: "Web Development", icon: "Code2" },
  { name: "Data Science", icon: "BarChart3" },
  { name: "Design", icon: "Palette" },
  { name: "Business", icon: "Briefcase" },
  { name: "Marketing", icon: "Megaphone" },
  { name: "Mobile Development", icon: "Smartphone" },
];

async function run() {
  await connectDB();

  console.log("🧹 Clearing old data...");
  await Promise.all([
    Category.deleteMany({}),
    Course.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("📁 Seeding categories...");
  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ ${createdCategories.length} categories`);

  console.log("👤 Seeding demo instructor...");
  const instructor = await User.create({
    clerkId: "seed_instructor_1",
    email: "jane.doe@eduflow.dev",
    firstName: "Jane",
    lastName: "Doe",
    role: "instructor",
    headline: "Senior Frontend Engineer · 10+ yrs",
    bio: "Teaching React, TypeScript and modern web development for over 6 years.",
  });

  console.log("📚 Seeding demo courses...");
  const webCat = createdCategories.find((c) => c.name === "Web Development");

  await Course.create({
    title: "Modern React with Vite & Tailwind",
    subtitle: "Build production-grade UIs faster",
    description:
      "Learn React 18, Vite, Tailwind, TanStack Query and Framer Motion by building real apps.",
    instructor: instructor._id,
    category: webCat._id,
    tags: ["react", "vite", "tailwind", "frontend"],
    level: "intermediate",
    price: 49.99,
    discountPrice: 19.99,
    status: "published",
    publishedAt: new Date(),
    whatYouWillLearn: [
      "Master React hooks & patterns",
      "Style with Tailwind CSS",
      "Manage server state with TanStack Query",
      "Add delightful animations with Framer Motion",
    ],
    requirements: ["Basic HTML/CSS/JS knowledge"],
    sections: [
      {
        title: "Getting Started",
        order: 0,
        lessons: [
          { title: "Welcome", duration: 180, isPreview: true, order: 0 },
          { title: "Dev environment setup", duration: 420, order: 1 },
        ],
      },
      {
        title: "Core React",
        order: 1,
        lessons: [
          { title: "Components & props", duration: 600, order: 0 },
          { title: "State & effects", duration: 720, order: 1 },
        ],
      },
    ],
  });

  await Course.create({
    title: "Node.js & Express API Masterclass",
    subtitle: "Design, build and secure REST APIs",
    description:
      "Ship production APIs with Express, MongoDB, JWT/Clerk auth, validation and testing.",
    instructor: instructor._id,
    category: webCat._id,
    tags: ["node", "express", "mongodb", "api"],
    level: "intermediate",
    price: 0,
    status: "published",
    publishedAt: new Date(),
    whatYouWillLearn: [
      "Build scalable Express servers",
      "Model data with Mongoose",
      "Secure APIs with Clerk",
      "Validate requests with Zod",
    ],
    sections: [
      {
        title: "Fundamentals",
        order: 0,
        lessons: [
          { title: "Node overview", duration: 300, isPreview: true, order: 0 },
          { title: "Express basics", duration: 480, order: 1 },
        ],
      },
    ],
  });

  console.log("🎉 Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});