import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { v4 as uuid } from "uuid";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { getIO, getUserSocket } from "../sockets/socket.js";

export const loginAuth = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        throw new Error("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password", 401);
    }

    const oldSession = await prisma.session.findFirst({
        where: {
            userId: user.id,
            isActive: true,
        },
    });

    if (oldSession) {
        await prisma.session.update({
            where: {
                id: oldSession.id,
            },
            data: {
                isActive: false,
            },
        });

        const socketId = getUserSocket(user.id);

        if (socketId) {
            getIO().to(socketId).emit("forceLogout", {
                message: "Logged in from another browser.",
            });
        }
    }

    const sessionId = uuid();

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            activeSessionId: sessionId,
        },
    });
    const accessToken = generateAccessToken({
        userId: user.id,
        role: user.role,
        sessionId,
    });
    const refreshToken = generateRefreshToken({
        userId: user.id,
    });


    await prisma.session.create({
        data: {
            id: sessionId,
            userId: user.id,
            refreshToken,
            isActive: true,
        },
    });
    return { accessToken, refreshToken };
};

export const logoutService = async (user) => {
    await prisma.session.update({
        where: {
            id: user.sessionId,
        },
        data: {
            isActive: false,
        },
    });

    await prisma.user.update({
        where: {
            id: user.userId,
        },
        data: {
            activeSessionId: null,
        },
    });
};