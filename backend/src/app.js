import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import cookieParser from "cookie-parser";
import rateLimiter from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

app.use(cors());

app.use(rateLimiter);

app.use(helmet());

app.use(express.json());
app.use(errorHandler);

app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Event Management API Running"
    });
});

export default app;