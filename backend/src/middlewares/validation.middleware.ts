import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../utils/apiError";

export const validate = (schema: ZodType<unknown>) => (req: Request, _res: Response, next: NextFunction) => {
    const wrappedPayload = {
        body: req.body,
        files: req.files ?? [],
    };

    // 1) try wrapped
    const wrapped = schema.safeParse(wrappedPayload);
    if (wrapped.success) {
        // if schema is wrapped, req.body should become validated body
        req.body = (wrapped.data as any).body ?? req.body;
        return next();
    }

    // 2) try plain body
    const plain = schema.safeParse(req.body);
    if (plain.success) {
        req.body = plain.data as any;
        return next();
    }

    // Prefer wrapped error if it contains "body" or "files" paths, otherwise plain.
    const errorToUse = wrapped.error.issues.some((i) => i.path[0] === "body" || i.path[0] === "files")
        ? wrapped.error
        : plain.error;

    const errorObj: Record<string, string> = {};
    for (const issue of errorToUse.issues) {
        const key = issue.path.join(".") || "body";
        if (!errorObj[key]) errorObj[key] = issue.message;
    }

    console.log(errorObj);
    return next(new ApiError(400, "Validation failed", errorObj));
};
