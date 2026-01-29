import { ZodError } from "zod";

/**
 * Converts a ZodError into a readable error message and structured field errors.
 */
export function formatZodErrors(error: ZodError) {
    const fieldErrors = error.flatten().fieldErrors as Record<string | number, string[]>;

    const summary = Object.entries(fieldErrors)
        .map(([field, messages]) => {
            if (!messages || messages.length === 0) return null;
            return `${messages.join(", ")}`;
        })
        .filter(Boolean)
        .join("; ");

    return {
        message: summary || "Invalid input",
        fieldErrors,
    };
}
