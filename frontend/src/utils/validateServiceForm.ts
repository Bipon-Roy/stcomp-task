import { serviceFormSchema, ServiceFormValues } from "@/validators/specialist.validator";
import { z } from "zod";

export type ServiceFormErrors = Partial<Record<string, string>>;

export function zodErrorsToMap(issues: z.ZodIssue[]): ServiceFormErrors {
   const out: ServiceFormErrors = {};
   for (const i of issues) {
      const key = i.path.join(".");
      if (!out[key]) out[key] = i.message;
   }
   return out;
}

export function validateServiceForm(values: ServiceFormValues) {
   const result = serviceFormSchema.safeParse(values);
   if (result.success) return { ok: true as const, errors: {} as ServiceFormErrors };
   return { ok: false as const, errors: zodErrorsToMap(result.error.issues) };
}
