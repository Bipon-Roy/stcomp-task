import * as React from "react";
import Image from "next/image";
import {
   Autocomplete,
   Box,
   Chip,
   FormControl,
   FormHelperText,
   IconButton,
   MenuItem,
   Select,
   Stack,
   TextField,
   Tooltip,
   Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ImageUploadField } from "./ImageUploadField";
import { type CreateSpecialistFormValues, type UpdateSpecialistFormValues } from "@/validators/specialist.validator";
import { ServiceFormErrors } from "@/hooks/useServiceForm";

type Mode = "create" | "edit";

type Props =
   | {
        mode: "create";
        value: CreateSpecialistFormValues;
        onChange: (next: CreateSpecialistFormValues) => void;
        additionalOfferingOptions: string[];
        errors?: ServiceFormErrors;
        onTouched?: (key: string) => void;
        existingImageUrls?: (string | null)[];
     }
   | {
        mode: "edit";
        value: UpdateSpecialistFormValues;
        onChange: (next: UpdateSpecialistFormValues) => void;
        additionalOfferingOptions: string[];
        errors?: ServiceFormErrors;
        onTouched?: (key: string) => void;
        existingImageUrls?: (string | null)[];
     };
const DESCRIPTION_MAX_WORDS = 500;

function countWords(s: string) {
   const trimmed = s.trim();
   if (!trimmed) return 0;
   return trimmed.split(/\s+/).length;
}

export function ServiceFormFields({
   mode,
   value,
   onChange,
   additionalOfferingOptions,
   errors = {},
   onTouched,
   existingImageUrls = [null, null, null],
}: Props) {
   const words = countWords(value.description);

   const err = (key: string) => errors[key];

   const setCommon = <K extends keyof (CreateSpecialistFormValues & UpdateSpecialistFormValues)>(
      key: K,
      v: (CreateSpecialistFormValues & UpdateSpecialistFormValues)[K]
   ) => {
      onChange({ ...(value as any), [key]: v } as any);
   };

   // ---------- image setters ----------
   const setCreateImageAt = (idx: number, file: File | null) => {
      if (mode !== "create") return;
      const next = [...value.images];
      next[idx] = file;
      onChange({ ...value, images: next });
      onTouched?.(`images.${idx}`);
   };

   const setUpdateImageAt = (idx: 0 | 1 | 2, file: File | null) => {
      if (mode !== "edit") return;

      const key = `image${idx}` as const satisfies "image0" | "image1" | "image2";
      onChange({ ...value, [key]: file } as UpdateSpecialistFormValues);
      onTouched?.(key);
   };

   // helpers to read current file
   const getCreateFile = (idx: 0 | 1 | 2) => (mode === "create" ? (value.images[idx] ?? null) : null);

   const getUpdateFile = (idx: 0 | 1 | 2) => {
      if (mode !== "edit") return null;
      if (idx === 0) return value.image0 ?? null;
      if (idx === 1) return value.image1 ?? null;
      return value.image2 ?? null;
   };

   const fileAt = (idx: 0 | 1 | 2) => (mode === "create" ? getCreateFile(idx) : getUpdateFile(idx));

   const onFileChange = (idx: 0 | 1 | 2, f: File | null) => {
      if (mode === "create") return setCreateImageAt(idx, f);
      return setUpdateImageAt(idx, f);
   };

   const imageErrorKey = (idx: 0 | 1 | 2) => {
      // create errors: images.0 / images.1 / images.2
      if (mode === "create") return `images.${idx}`;
      // update errors: image0 / image1 / image2
      return `image${idx}`;
   };

   return (
      <Stack spacing={2.25}>
         {/* Title */}
         <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222", mb: 0.75 }}>Title</Typography>
            <TextField
               fullWidth
               size="small"
               placeholder="Enter your service title"
               value={value.title}
               onChange={(e) => setCommon("title", e.target.value)}
               onBlur={() => onTouched?.("title")}
               error={!!err("title")}
            />
            {!!err("title") && <FormHelperText error>{err("title")}</FormHelperText>}
         </Box>

         {/* Description */}
         <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222", mb: 0.75 }}>Description</Typography>
            <TextField
               fullWidth
               multiline
               minRows={5}
               placeholder="Describe your service here"
               value={value.description}
               onChange={(e) => setCommon("description", e.target.value)}
               onBlur={() => onTouched?.("description")}
               error={!!err("description")}
            />
            {!!err("description") && <FormHelperText error>{err("description")}</FormHelperText>}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
               <Typography sx={{ fontSize: 11, color: "#667085" }}>
                  ({Math.min(words, DESCRIPTION_MAX_WORDS)} words)
               </Typography>
            </Box>
         </Box>

         {/* Estimated Completion Time */}
         <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222", mb: 0.75 }}>
               Estimated Completion Time (Days)
            </Typography>
            <FormControl fullWidth size="small" error={!!err("estimatedDays")}>
               <Select
                  value={value.estimatedDays}
                  onChange={(e) => setCommon("estimatedDays", Number(e.target.value))}
                  onBlur={() => onTouched?.("estimatedDays")}
               >
                  {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((d) => (
                     <MenuItem key={d} value={d}>
                        {d} {d === 1 ? "day" : "days"}
                     </MenuItem>
                  ))}
               </Select>
               {!!err("estimatedDays") && <FormHelperText>{err("estimatedDays")}</FormHelperText>}
            </FormControl>
         </Box>

         {/* Status */}
         <Box>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
               <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222" }}>Approval Status</Typography>
               <Tooltip
                  title="Simplified for now to meet assessment requirement"
                  slotProps={{
                     tooltip: { sx: { bgcolor: "#000", color: "#fff", fontSize: 12, fontWeight: 400, px: 1, ml: 3 } },
                  }}
               >
                  <IconButton size="small" sx={{ color: "#888888", p: 0.25 }}>
                     <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
               </Tooltip>
            </Stack>

            <FormControl fullWidth size="small" error={!!err("status")}>
               <Select
                  value={value.status}
                  onChange={(e) => setCommon("status", e.target.value as CreateSpecialistFormValues["status"])}
                  onBlur={() => onTouched?.("status")}
                  sx={{ textTransform: "capitalize" }}
               >
                  {["under-review", "approved", "rejected"].map((s) => (
                     <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>
                        {s}
                     </MenuItem>
                  ))}
               </Select>
               {!!err("status") && <FormHelperText>{err("status")}</FormHelperText>}
            </FormControl>
         </Box>

         {/* Price */}
         <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222", mb: 0.75 }}>Price</Typography>

            <div
               className={[
                  "flex w-full border rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/90",
                  err("price") ? "border-red-500" : "border-gray-300",
               ].join(" ")}
            >
               <div className="flex items-center gap-1.5 bg-gray-100 px-3">
                  <Image src="/flag2.jpg" width={20} height={14} alt="Currency Flag" />
                  <span className="text-sm text-[#222222]">MYR</span>
               </div>

               <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={value.price}
                  onChange={(e) => setCommon("price", e.target.value)}
                  onBlur={() => onTouched?.("price")}
                  className="flex-1 px-3 py-2 outline-none text-sm"
               />
            </div>

            {!!err("price") && <FormHelperText error>{err("price")}</FormHelperText>}
         </Box>

         {/* Additional Offerings */}
         <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222", mb: 0.75 }}>
               Additional Offerings (Temporary Optional)
            </Typography>

            <Autocomplete
               multiple
               options={additionalOfferingOptions}
               value={value.additionalOfferings ?? []}
               onChange={(_, next) => {
                  setCommon("additionalOfferings", next);
                  onTouched?.("additionalOfferings");
               }}
               onBlur={() => onTouched?.("additionalOfferings")}
               renderValue={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                     <Chip
                        size="small"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        sx={{ borderRadius: 999 }}
                     />
                  ))
               }
               renderInput={(params) => (
                  <TextField
                     {...params}
                     size="small"
                     placeholder="Select offerings"
                     error={!!err("additionalOfferings")}
                  />
               )}
            />

            {!!err("additionalOfferings") && <FormHelperText error>{err("additionalOfferings")}</FormHelperText>}
         </Box>

         {/* Images (create vs edit) */}
         <ImageUploadField
            label="Service - Image (1st)"
            file={fileAt(0)}
            onChange={(f) => onFileChange(0, f)}
            errorText={err(imageErrorKey(0))}
            onTouched={() => onTouched?.(imageErrorKey(0))}
            existingUrl={existingImageUrls?.[0] ?? null}
         />

         <ImageUploadField
            label="Service - Image (2nd)"
            file={fileAt(1)}
            onChange={(f) => onFileChange(1, f)}
            errorText={err(imageErrorKey(1))}
            onTouched={() => onTouched?.(imageErrorKey(1))}
            existingUrl={existingImageUrls?.[1] ?? null}
         />

         <ImageUploadField
            label="Service - Image (3rd)"
            file={fileAt(2)}
            onChange={(f) => onFileChange(2, f)}
            errorText={err(imageErrorKey(2))}
            onTouched={() => onTouched?.(imageErrorKey(2))}
            existingUrl={existingImageUrls?.[2] ?? null}
         />
      </Stack>
   );
}
