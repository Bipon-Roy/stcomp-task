import { z } from "zod";
import { MimeType } from "../entities/enums/specialist.enum";

const DESCRIPTION_MAX_WORDS = 500;

function countWords(s: string) {
    const trimmed = s.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

const ACCEPTED_IMAGE_TYPES: string[] = [MimeType.IMAGE_PNG, MimeType.IMAGE_JPEG, MimeType.IMAGE_WEBP];
const MAX_IMAGE_MB = 4;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const multerFileSchema = z
    .object({
        originalname: z.string(),
        mimetype: z.string(),
        size: z.number(),
        path: z.string(),
    })
    .refine((f) => f.size <= MAX_IMAGE_BYTES, `Maximum file size: ${MAX_IMAGE_MB}MB`)
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.mimetype), "Accepted: JPG, PNG, WEBP");

export const createSpecialistBodySchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .refine((v) => countWords(v) <= DESCRIPTION_MAX_WORDS, `Maximum ${DESCRIPTION_MAX_WORDS} words`),

    status: z.enum(["pending", "under-review", "approved", "rejected"]),
    estimatedDays: z.coerce.number().min(1, "Estimated days is required"),

    price: z
        .string()
        .trim()
        .min(1, "Price is required")
        .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Use a valid amount (e.g. 0.00, 10, 10.50)"),

    additionalOfferings: z.preprocess((val) => {
        // frontend sends JSON string
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return [];
            }
        }
        return val;
    }, z.array(z.string()).optional().default([])),
});

export const createSpecialistSchema = z.object({
    body: createSpecialistBodySchema,
    files: z.array(multerFileSchema).length(3, "Exactly 3 images are required"),
});

export type CreateSpecialistBody = z.infer<typeof createSpecialistBodySchema>;

export const publishSpecialistSchema = z.object({
    serviceId: z
        .string()
        .refine((v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v), {
            message: "Invalid service id",
        }),
});
