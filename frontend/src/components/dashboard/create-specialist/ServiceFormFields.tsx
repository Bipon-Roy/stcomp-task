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
import { ServiceFormValues } from "@/validators/specialist.validator";
import { ServiceFormErrors } from "@/hooks/useServiceForm";

interface Props {
   value: ServiceFormValues;
   onChange: (next: ServiceFormValues) => void;
   additionalOfferingOptions: string[];
   errors?: ServiceFormErrors;
   onTouched?: (key: string) => void;
   existingImageUrls?: (string | null)[]; // ✅ add
}

const DESCRIPTION_MAX_WORDS = 500;

function countWords(s: string) {
   const trimmed = s.trim();
   if (!trimmed) return 0;
   return trimmed.split(/\s+/).length;
}

export function ServiceFormFields({
   value,
   onChange,
   additionalOfferingOptions,
   errors = {},
   onTouched,
   existingImageUrls = [null, null, null],
}: Props) {
   const words = countWords(value.description);

   const set = <K extends keyof ServiceFormValues>(key: K, v: ServiceFormValues[K]) => {
      onChange({ ...value, [key]: v });
   };

   const setImageAt = (idx: number, file: File | null) => {
      const next = [...value.images];
      next[idx] = file;
      set("images", next);
      onTouched?.(`images.${idx}`);
   };

   const err = (key: string) => errors[key];

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
               onChange={(e) => set("title", e.target.value)}
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
               onChange={(e) => set("description", e.target.value)}
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
                  onChange={(e) => set("estimatedDays", Number(e.target.value))}
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
                     tooltip: {
                        sx: {
                           bgcolor: "#000",
                           color: "#fff",
                           fontSize: 12,
                           fontWeight: 400,
                           px: 1,
                           ml: 3,
                        },
                     },
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
                  onChange={(e) => set("status", e.target.value as ServiceFormValues["status"])}
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
                  onChange={(e) => set("price", e.target.value)}
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
                  set("additionalOfferings", next);
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

         {/* Images */}
         <ImageUploadField
            label="Service - Image (1st)"
            file={value.images[0] ?? null}
            onChange={(f) => setImageAt(0, f)}
            errorText={err("images.0")}
            onTouched={() => onTouched?.("images.0")}
            existingUrl={existingImageUrls?.[0] ?? null}
         />
         <ImageUploadField
            label="Service - Image (2nd)"
            file={value.images[1] ?? null}
            onChange={(f) => setImageAt(1, f)}
            errorText={err("images.1")}
            onTouched={() => onTouched?.("images.1")}
            existingUrl={existingImageUrls?.[0] ?? null}
         />
         <ImageUploadField
            label="Service - Image (3rd)"
            file={value.images[2] ?? null}
            onChange={(f) => setImageAt(2, f)}
            errorText={err("images.2")}
            onTouched={() => onTouched?.("images.2")}
            existingUrl={existingImageUrls?.[0] ?? null}
         />
      </Stack>
   );
}
