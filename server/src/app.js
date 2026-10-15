import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import routes from "./routes/index.js";

const app = express();

// ---- global middleware ----
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(compression());
app.use(hpp());
app.use(rateLimiter);

// HTTP request logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// Clerk auth — attaches auth object to req
app.use(clerkMiddleware());

// ---- API routes ----
app.use("/api", routes);

// ---- health check ----
app.get("/api/health", (req, res) =>
  res.json({ success: true, status: 200, data: { ok: true } })
);

// ---- 404 catcher ----
app.use(notFound);

// ---- global error handler (must be last) ----
app.use(errorHandler);

export default app;
