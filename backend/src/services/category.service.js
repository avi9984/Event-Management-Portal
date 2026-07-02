import prisma from "../config/prisma.js";
import { success, error } from "../utils/apiResponse.js";


const buildCategoryTree = (categories, parentId = null) => {
    return categories
        .filter((category) => category.parentId === parentId)
        .map((category) => ({
            id: category.id,
            name: category.name,
            parentId: category.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            children: buildCategoryTree(categories, category.id),
        }));
};

export const createCategory = async ({ name, parentId }) => {
    // 1. Verify parent exists if parentId is provided
    if (parentId) {
        const parent = await prisma.category.findUnique({
            where: { id: parentId },
        });

        if (!parent) {
            throw new AppError("Parent category not found.", 404);
        }
    }

    // 2. Check if this name already exists UNDER THE SAME PARENT
    // Note: Use findFirst because findUnique only works with defined @@unique indexes
    const existingCategory = await prisma.category.findFirst({
        where: {
            name,
            parentId: parentId || null, // Handles root categories correctly
        },
    });

    if (existingCategory) {
        throw new Error("A category with this name already exists in this location.");
    }

    // 3. Create the category
    return prisma.category.create({
        data: {
            name,
            parentId,
        },
    });
};

export const getCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return buildCategoryTree(categories);
};

export const updateCategory = async (id, data) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });
    // console.log(category, "category");

    if (!category) {
        throw new Error("Category not found.");
    }

    if (data.parentId === id) {
        throw new Error("A category cannot be its own parent.");
    }

    return prisma.category.update({
        where: { id },
        data,
    });
};

export const deleteCategory = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            children: true,
            events: true,
        },
    });

    if (!category) {
        throw new Error("Category not found.");
    }

    if (category.children.length) {
        throw new Error("Delete child categories first.");
    }

    if (category.events.length) {
        throw new Error("Category contains events.");
    }

    await prisma.category.delete({
        where: { id },
    });

    return true;
};