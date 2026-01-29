import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import http from "http";
import { app } from "./app";
import { connectDB, disconnectDB } from "./src/db/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        const gracefulShutdown = async (signal: string) => {
            console.log(`🛑 ${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                console.log("💥 HTTP server closed");

                try {
                    await disconnectDB();
                } catch (err) {
                    console.error("❌ Error during DB shutdown:", err);
                }

                process.exit(0);
            });
        };

        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

        process.on("unhandledRejection", (reason, promise) => {
            console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
        });

        process.on("uncaughtException", (err) => {
            console.error("🚨 Uncaught Exception:", err);
            process.exit(1);
        });
    } catch (err) {
        console.error("❌ Server failed:", err);
        process.exit(1);
    }
}

startServer();
