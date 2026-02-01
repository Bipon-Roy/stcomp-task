import { serviceFormSchema, ServiceFormValues } from "@/validators/specialist.validator";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";

export type ServiceFormErrors = Partial<Record<string, string>>;
type TouchedMap = Record<string, boolean>;

function zodErrorsToMap(issues: z.ZodIssue[]): ServiceFormErrors {
   const out: ServiceFormErrors = {};
   for (const i of issues) {
      const key = i.path.join(".");
      if (!out[key]) out[key] = i.message;
   }
   return out;
}

export function useServiceForm(initial: ServiceFormValues) {
   const [value, setValue] = useState<ServiceFormValues>(initial);
   const [touched, setTouched] = useState<TouchedMap>({});

   const errors = useMemo(() => {
      const r = serviceFormSchema.safeParse(value);
      return r.success ? {} : zodErrorsToMap(r.error.issues);
   }, [value]);

   const onChange = useCallback((next: ServiceFormValues) => {
      setValue(next);
   }, []);

   const onTouched = useCallback((key: string) => {
      setTouched((p) => ({ ...p, [key]: true }));
   }, []);

   const visibleErrors = useMemo(() => {
      const out: ServiceFormErrors = {};
      for (const [k, msg] of Object.entries(errors)) {
         if (touched[k]) out[k] = msg;
      }
      return out;
   }, [errors, touched]);

   const validateAll = useCallback(() => {
      const r = serviceFormSchema.safeParse(value);
      if (r.success) return { ok: true as const, errors: {} as ServiceFormErrors };

      const map = zodErrorsToMap(r.error.issues);
      setTouched((prev) => {
         const next = { ...prev };
         Object.keys(map).forEach((k) => (next[k] = true));
         return next;
      });

      return { ok: false as const, errors: map };
   }, [value]);

   const reset = useCallback((next: ServiceFormValues) => {
      setValue(next);
      setTouched({});
   }, []);

   return { value, onChange, errors: visibleErrors, onTouched, validateAll, reset };
}
