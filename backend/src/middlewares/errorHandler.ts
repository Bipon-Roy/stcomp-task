import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    // Set default status code to 500 if not provided
    const statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === "development") {
        console.error("Error stack:", err.stack);
    }

    // Send error response to client
    res.status(statusCode).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        statusCode,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        // data: err.data,
    });
};

export { errorHandler };
