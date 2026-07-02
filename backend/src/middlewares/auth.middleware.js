import jwt from "jsonwebtoken";
// import { success, error } from "../utils/apiResponse.js";
import prisma from "../config/prisma.js";

export default async function (req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.activeSessionId !== decoded.sessionId) {
            return res.status(401).json({ success: false, message: "You have logged in from another browser.", });
        }

        const session = await prisma.session.findUnique({
            where: {
                id: decoded.sessionId,
            },
        });

        if (!session || !session.isActive) {
            return res.status(401).json({
                success: false,
                message: "Session expired.",
            });
        }

        req.user = decoded;

        next();
    } catch (err) {
        next(err);
    }
}