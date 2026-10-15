import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }

  const server = http.createServer(app);

  const PORT = env.PORT;
  server.listen(PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info("Shutting down gracefully");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();
