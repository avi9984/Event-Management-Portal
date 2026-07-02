import { z } from "zod";

export const createEventSchema = z.object({
    title: z.string().trim().min(3).max(200),

    description: z.string().trim().min(10),

    categoryId: z.string().uuid(),

    publishAt: z.string().datetime(),
});