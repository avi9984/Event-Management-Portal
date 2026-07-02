import jwt from "jsonwebtoken";
import { success, error } from "../utils/apiResponse.js";
import prisma from "../config/prisma.js";

export default async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return error(res, "Unauthorized", 401)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            return error(res, "User not found", 404);
        }

        if (decoded.sessionId !== user.activeSessionId) {
            return error(res, "You have logged in from another browser.", 401);
        }

        req.user = decoded;

        next();
    } catch (err) {
        next(err);
    }
};