import { CorsOptions } from "cors";

const allowedOrigins = [process.env.FRONTEND_BASE_URL || "https://stcomp-task-28yg.vercel.app"];

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
};
