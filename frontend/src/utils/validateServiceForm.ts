import { ZodError } from "zod";

export type ServiceFormErrors = Partial<Record<string, string>>;

export function zodErrorsToMap(issues: ZodError["issues"]): ServiceFormErrors {
   const out: ServiceFormErrors = {};

   for (const i of issues) {
      const key = i.path.join(".");
      if (!out[key]) out[key] = i.message;
   }

   return out;
}
