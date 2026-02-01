import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../utils/apiError";

export const validate = (schema: ZodType<any>) => (req: Request, _res: Response, next: NextFunction) => {
    const payload = {
        body: req.body,
        files: (req.files ?? []) as Express.Multer.File[],
    };

    const result = schema.safeParse(payload);

    if (!result.success) {
        const errorObj: Record<string, string> = {};

        result.error.issues.forEach((err) => {
            const fieldName = err.path.join(".");
            if (!errorObj[fieldName]) errorObj[fieldName] = err.message;
        });

        return next(new ApiError(400, "Validation failed", errorObj));
    }

    req.body = result.data.body;

    next();
};
