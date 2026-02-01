import { ServiceFormValues } from "@/validators/specialist.validator";

export function buildServiceFormData(values: ServiceFormValues) {
   const formData = new FormData();

   formData.append("title", values.title);
   formData.append("description", values.description);
   formData.append("status", values.status);
   formData.append("estimatedDays", String(values.estimatedDays));
   formData.append("price", values.price);

   // array -> send as JSON string (simplest + reliable)
   formData.append("additionalOfferings", JSON.stringify(values.additionalOfferings ?? []));

   // images: append only if file exists
   values.images.forEach((file) => {
      if (file) formData.append("images", file);
   });

   return formData;
}
