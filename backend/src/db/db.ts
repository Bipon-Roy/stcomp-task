import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

declare global {
    var __appDataSource: DataSource | undefined;
}

export const connectDB = async () => {
    if (global.__appDataSource?.isInitialized) {
        return global.__appDataSource;
    }

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) throw new Error("❌ Missing DATABASE_URL");

    const entitiesPath = path.join(__dirname, "..", "entities", "*.{ts,js}");
    const migrationsPath = path.join(__dirname, "..", "migrations", "*.{ts,js}");

    const ds = new DataSource({
        type: "postgres",
        url: DATABASE_URL,
        synchronize: process.env.NODE_ENV !== "production",
        logging: false,
        entities: [entitiesPath],
        migrations: [migrationsPath],
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });

    global.__appDataSource = ds;

    await ds.initialize();
    console.log("✅ Database connected");
    return ds;
};

export const disconnectDB = async () => {
    if (global.__appDataSource?.isInitialized) {
        await global.__appDataSource.destroy();
        console.log("🔌 Database connection closed");
    }
};
