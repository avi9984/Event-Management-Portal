import "dotenv/config";
import http from "node:http";
import { initSocket } from "./sockets/socket.js";

import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});