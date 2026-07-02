import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = Router();

router.use(authMiddleware);

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getCategories);

router.put("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

export default router;