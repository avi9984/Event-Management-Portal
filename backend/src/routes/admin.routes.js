import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", adminController.dashboard);

router.get("/events", adminController.getEvents);

router.delete("/events/:id/permanent", adminController.permanentDelete);

export default router;