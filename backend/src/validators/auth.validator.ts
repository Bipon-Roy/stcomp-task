import * as z from "zod";

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, { error: "Email can't be empty" })
        .pipe(z.email({ error: "Invalid email format" })),

    password: z.string().min(1, { error: "Password can't be empty" }),
});
