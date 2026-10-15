import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import * as admin from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireRole("admin"));

router.get("/stats",            admin.getStats);

router.get("/users",            admin.listUsers);
router.patch("/users/:id/role", admin.updateUserRole);
router.delete("/users/:id",     admin.deleteUser);

router.get("/courses",             admin.listAllCourses);
router.patch("/courses/:id/status", admin.updateCourseStatus);
router.delete("/courses/:id",       admin.deleteCourse);

export default router;
