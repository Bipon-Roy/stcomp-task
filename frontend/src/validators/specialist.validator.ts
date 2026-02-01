import { z } from "zod";

const DESCRIPTION_MAX_WORDS = 500;

function countWords(s: string) {
   const trimmed = s.trim();
   if (!trimmed) return 0;
   return trimmed.split(/\s+/).length;
}

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_IMAGE_MB = 4;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const fileSchema = z
   .instanceof(File)
   .refine((f) => f.size <= MAX_IMAGE_BYTES, `Maximum file size: ${MAX_IMAGE_MB}MB`)
   .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), "Accepted: JPG, PNG, WEBP");

export const serviceFormSchema = z.object({
   title: z.string().trim().min(1, "Title is required"),
   description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .refine((v) => countWords(v) <= DESCRIPTION_MAX_WORDS, `Maximum ${DESCRIPTION_MAX_WORDS} words`),

   status: z.enum(["pending", "under-review", "approved", "rejected"]),
   estimatedDays: z.number().min(1, "Estimated days is required"),
   price: z
      .string()
      .trim()
      .min(1, "Price is required")
      .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Use a valid amount (e.g. 0.00, 10, 10.50)"),

   additionalOfferings: z.array(z.string()).optional().default([]),
   images: z
      .array(z.union([fileSchema, z.null()]))
      .length(3, "Exactly 3 image slots are required")
      .superRefine((arr, ctx) => {
         arr.forEach((img, idx) => {
            if (!img) {
               ctx.addIssue({
                  code: "custom",
                  message: "Image is required",
                  path: [idx],
               });
            }
         });
      }),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
