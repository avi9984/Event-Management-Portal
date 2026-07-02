import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validations/category.validation.js";


const router = Router();

router.use(authMiddleware);

router.post("/", validate(createCategorySchema), categoryController.createCategory);

router.get("/", categoryController.getCategories);

router.put("/:id", validate(updateCategorySchema), categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

export default router;