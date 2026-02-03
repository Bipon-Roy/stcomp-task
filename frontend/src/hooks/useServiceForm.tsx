import {
   createSpecialistSchema,
   updateSpecialistSchema,
   type CreateSpecialistFormValues,
   type UpdateSpecialistFormValues,
} from "@/validators/specialist.validator";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";

export type ServiceFormErrors = Partial<Record<string, string>>;
type TouchedMap = Record<string, boolean>;

type FormMode = "create" | "update";
type FormValues<M extends FormMode> = M extends "create" ? CreateSpecialistFormValues : UpdateSpecialistFormValues;

// ✅ fixes "ZodIssue is deprecated" warning
type ZodIssues = z.ZodError["issues"];

function zodErrorsToMap(issues: ZodIssues): ServiceFormErrors {
   const out: ServiceFormErrors = {};
   for (const i of issues) {
      const key = i.path.join(".");
      if (!out[key]) out[key] = i.message;
   }
   return out;
}

function getSchema(mode: FormMode) {
   return mode === "create" ? createSpecialistSchema : updateSpecialistSchema;
}

export function useServiceForm<M extends FormMode>(mode: M, initial: FormValues<M>) {
   const schema = useMemo(() => getSchema(mode), [mode]);

   const [value, setValue] = useState<FormValues<M>>(initial);
   const [touched, setTouched] = useState<TouchedMap>({});

   const errors = useMemo(() => {
      const r = schema.safeParse(value);
      return r.success ? {} : zodErrorsToMap(r.error.issues);
   }, [schema, value]);

   const onChange = useCallback((next: FormValues<M>) => {
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
      const r = schema.safeParse(value);
      if (r.success) return { ok: true as const, errors: {} as ServiceFormErrors };

      const map = zodErrorsToMap(r.error.issues);
      setTouched((prev) => {
         const next = { ...prev };
         Object.keys(map).forEach((k) => (next[k] = true));
         return next;
      });

      return { ok: false as const, errors: map };
   }, [schema, value]);

   const reset = useCallback((next: FormValues<M>) => {
      setValue(next);
      setTouched({});
   }, []);

   return { value, onChange, errors: visibleErrors, onTouched, validateAll, reset };
}
