import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";

import userRoutes from "./user.routes.js";
import courseRoutes from "./course.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";
import reviewRoutes from "./review.routes.js";
import uploadRoutes from "./upload.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use(optionalAuth);

router.use("/users",       userRoutes);
router.use("/courses",     courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/reviews",     reviewRoutes);
router.use("/uploads",     uploadRoutes);
router.use("/admin",       adminRoutes);

export default router;
