import "reflect-metadata";
import { DataSource } from "typeorm";

let AppDataSource: DataSource | null = null;

export const connectDB = async () => {
    if (AppDataSource && AppDataSource.isInitialized) {
        console.log("♻️ Using existing database connection");
        return AppDataSource;
    }

    if (!process.env.DATABASE_URL) {
        throw new Error("❌ Missing DATABASE_URL");
    }

    AppDataSource = new DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: [__dirname + "/../entities/*.{ts,js}"],
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });

    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected ");
        return AppDataSource;
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
};

export const disconnectDB = async () => {
    if (AppDataSource && AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log("🔌 Database connection closed");
    }
};
