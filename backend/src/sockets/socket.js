import { Server } from "socket.io";

let io;

// userId -> socketId
const connectedUsers = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket Connected:", socket.id);

        socket.on("register", (userId) => {
            connectedUsers.set(userId, socket.id);

            console.log(`User ${userId} registered with ${socket.id}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }

            console.log("Socket Disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => io;

export const getUserSocket = (userId) => connectedUsers.get(userId);