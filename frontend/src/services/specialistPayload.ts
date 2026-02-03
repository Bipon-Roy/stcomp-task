import { CreateSpecialistFormValues, UpdateSpecialistFormValues } from "@/validators/specialist.validator";

type Mode = "create" | "update";

export function buildServiceFormData(
   values: CreateSpecialistFormValues | UpdateSpecialistFormValues,
   mode: Mode = "create"
) {
   const formData = new FormData();

   formData.append("title", values.title);
   formData.append("description", values.description);
   formData.append("status", values.status);
   formData.append("estimatedDays", String(values.estimatedDays));
   formData.append("price", values.price);

   formData.append("additionalOfferings", JSON.stringify(values.additionalOfferings ?? []));

   // ---------- create mode ----------
   if (mode === "create") {
      const createValues = values as CreateSpecialistFormValues;

      createValues.images.forEach((file) => {
         if (file) {
            // backend expects multiple under same key
            formData.append("images", file);
         }
      });
   }

   if (mode === "update") {
      const updateValues = values as UpdateSpecialistFormValues;

      if (updateValues.image0) {
         formData.append("image0", updateValues.image0);
      }

      if (updateValues.image1) {
         formData.append("image1", updateValues.image1);
      }

      if (updateValues.image2) {
         formData.append("image2", updateValues.image2);
      }
   }

   return formData;
}
