import { serviceFormSchema, ServiceFormValues } from "@/validators/specialist.validator";
import { useState } from "react";
import { z } from "zod";
import { usePostWithFormData, useUpdateWithFormData } from "./useMutation";
import { buildServiceFormData } from "@/services/specialistPayload";

type FieldErrors = Partial<Record<keyof ServiceFormValues, string>>;

function zodToFieldErrors(err: z.ZodError): FieldErrors {
   const out: FieldErrors = {};
   for (const issue of err.issues) {
      const key = issue.path?.[0] as keyof ServiceFormValues | undefined;
      if (key && !out[key]) out[key] = issue.message;
   }
   return out;
}

export function useServiceUpsert(opts: { mode: "create" | "edit"; url: string; mutationKey: string; id?: string }) {
   const [errors, setErrors] = useState<FieldErrors>({});

   const createMutation = usePostWithFormData(opts.mutationKey, opts.url);
   const updateMutation = useUpdateWithFormData(opts.mutationKey, opts.url);

   const isSubmitting = opts.mode === "create" ? createMutation.isPending : updateMutation.isPending;

   const submit = async (values: ServiceFormValues) => {
      setErrors({});

      const parsed = serviceFormSchema.safeParse(values);
      if (!parsed.success) {
         const fieldErrors = zodToFieldErrors(parsed.error);
         setErrors(fieldErrors);
         return { ok: false as const, errors: fieldErrors };
      }

      const fd = buildServiceFormData(parsed.data);

      return new Promise<{ ok: boolean; data?: any; errors?: FieldErrors }>((resolve) => {
         const onSuccess = (data: any) => resolve({ ok: true, data });
         const onError = () => resolve({ ok: false });

         if (opts.mode === "create") {
            createMutation.mutate(fd, { onSuccess, onError });
         } else {
            updateMutation.mutate(fd, { onSuccess, onError });
         }
      });
   };

   return { submit, errors, isSubmitting, setErrors };
}
