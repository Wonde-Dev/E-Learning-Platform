import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { env } from "./env.js";

export const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment");
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      dbName: env.MONGO_URI.split("/").pop().split("?")[0] || "elearning",
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
};
