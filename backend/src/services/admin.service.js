import prisma from "../config/prisma.js";

export const getAllEvents = async ({ status, page = 1, limit = 10, search = "" }, next) => {
    try {
        page = Number(page);
        limit = Number(limit);

        const skip = (page - 1) * limit;

        const where = {};

        if (status === "published") {
            where.deletedAt = null;

            where.publishAt = {
                lte: new Date()
            };
        }

        if (status === "waiting") {
            where.deletedAt = null;

            where.publishAt = {
                gt: new Date()
            };
        }

        if (status === "deleted") {
            where.deletedAt = {
                not: null
            };
        }

        if (search) {
            where.title = {
                contains: search,
                mode: "insensitive"
            };
        }

        const [events, total] = await prisma.$transaction([
            prisma.event.findMany({
                where,

                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true
                        }
                    },

                    category: true,

                    media: true
                },

                orderBy: {
                    createdAt: "desc"
                },

                skip,

                take: limit
            }),

            prisma.event.count({
                where
            })
        ]);

        return {
            events,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        next(error)
    }
};

export const dashboardStats = async () => {

    const now = new Date();

    const [total, published, waiting, deleted, users] = await prisma.$transaction([

        prisma.event.count(),

        prisma.event.count({
            where: {
                deletedAt: null,
                publishAt: {
                    lte: now
                }
            }
        }),

        prisma.event.count({
            where: {
                deletedAt: null,
                publishAt: {
                    gt: now
                }
            }
        }),

        prisma.event.count({
            where: {
                deletedAt: {
                    not: null
                }
            }
        }),

        prisma.user.count()

    ]);

    return {
        total,
        published,
        waiting,
        deleted,
        users
    };
};