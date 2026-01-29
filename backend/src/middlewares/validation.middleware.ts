import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Create an object with keys as field names and values as error messages
        const errorObj: Record<string, string> = {};

        result.error.issues.forEach((err) => {
            const fieldName = err.path.join(".");
            // If multiple errors on same field, you can decide to concatenate or keep first
            if (!errorObj[fieldName]) {
                errorObj[fieldName] = err.message;
            }
        });

        return next(new ApiError(400, "Validation failed", errorObj));
    }

    req.body = result.data;
    next();
};
