import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createEventSchema } from "../validations/event.validation.js";
import * as eventController from "../controllers/event.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", upload.array("photos", 10), validate(createEventSchema), eventController.createEvent);

router.get("/", eventController.getPublishedEvents);

router.delete("/:id", eventController.softDelete);

router.delete("/:id/permanent", eventController.permanentDelete);

router.get("/admin", eventController.adminEvents);

export default router;