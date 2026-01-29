import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { corsConfig } from "./config/cors";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json({ limit: "180kb" }));
app.use(express.urlencoded({ extended: true, limit: "180kb" }));

// Middleware

app.use(cors(corsConfig));

app.use(cookieParser());

// Default Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "The Server is running",
    });
});
app.use("/api/v1/auth", authRoutes);

// Handle 404 errors (non-existent routes)
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

export { app };
