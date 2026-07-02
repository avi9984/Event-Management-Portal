import prisma from "../config/prisma.js";
import { DateTime } from "luxon";

export const createEvent = async (userId, body, files) => {
    const category = await prisma.category.findUnique({
        where: {
            id: body.categoryId,
        },
    });

    if (!category) {
        throw new Error("Category not found.");
    }

    if (!files.length) {
        throw new Error("Please upload at least one image.");
    }

    const publishAt = DateTime.fromISO(body.publishAt, { zone: "utc" }).toJSDate();

    return prisma.event.create({
        data: {
            title: body.title,
            description: body.description,
            publishAt,
            userId,
            categoryId: body.categoryId,

            media: {
                create: files.map((file) => ({
                    fileName: file.filename,
                    imageUrl: `/uploads/${file.filename}`,
                    mimeType: file.mimetype,
                    fileSize: file.size,
                })),
            },
        },

        include: {
            media: true,
            category: true,
        },
    });
};


export const getPublishedEvents = async (timezone, page, limit, search) => {
    const skip = (page - 1) * limit;

    const events = await prisma.event.findMany({
        where: {
            deletedAt: null,

            publishAt: {
                lte: new Date(),
            },

            title: {
                contains: search,
                mode: "insensitive",
            },
        },

        include: { media: true, category: true },
        skip,
        take: limit,
        orderBy: {
            publishAt: "desc",
        },
    });

    return events.map((event) => ({
        ...event,

        publishAt: DateTime.fromJSDate(event.publishAt)
            .setZone(timezone)
            .toISO(),
    }));
};

export const deleteEvent = async (id) => {
    return prisma.event.update({
        where: { id },

        data: {
            deletedAt: new Date(),
        },
    });
};

export const permanentDelete = async (id) => {
    return prisma.event.delete({
        where: { id },
    });
};

export const adminEvents = async (status) => {
    const where = {};

    if (status === "published") {
        where.publishAt = { lte: new Date() };
        where.deletedAt = null;
    }

    if (status === "waiting") {
        where.publishAt = { gt: new Date() };

        where.deletedAt = null;
    }

    if (status === "deleted") {
        where.deletedAt = { not: null };
    }

    return prisma.event.findMany({
        where,

        include: {
            createdBy: true,
            media: true,
            category: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

