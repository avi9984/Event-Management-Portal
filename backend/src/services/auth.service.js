import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { v4 as uuid } from "uuid";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const loginAuth = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
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