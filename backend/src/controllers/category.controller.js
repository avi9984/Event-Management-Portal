import * as categoryService from "../services/category.service.js";
import { success, error } from "../utils/apiResponse.js";


export const createCategory = async (req, res, next) => {
    try {
        const { name, parentId } = req.body;
        if (!name) {
            throw new AppError("Category name is required", 400);
        }

        const result = await categoryService.createCategory({ name, parentId });
        return success(res, result, "Category created successfully", 201);
    } catch (error) {
        next(error)
    }
}

export const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};


export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, parentId } = req.body;

        if (!name && parentId === undefined) {
            throw new Error("No update data provided");
        }

        await categoryService.updateCategory(id, {
            name,
            parentId,
        });

        return success(res, "Category updated successfully", 200);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Category ID is required", 400);
        }
        await categoryService.deleteCategory(id);

        return success(res, "Category deleted successfully", 200);
    } catch (error) {
        next(error);
    }
};
