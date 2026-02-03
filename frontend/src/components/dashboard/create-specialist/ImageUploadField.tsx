import * as React from "react";
import { Box, Button, FormHelperText, IconButton, Paper, Stack, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function formatBytes(bytes: number) {
   if (!bytes && bytes !== 0) return "";
   const units = ["B", "KB", "MB", "GB"];
   let i = 0;
   let n = bytes;
   while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
   }
   return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

interface Props {
   label: string;
   file: File | null;
   existingUrl?: string | null; // ✅ new
   onChange: (file: File | null) => void;
   accept?: string;
   maxSizeMb?: number;
   errorText?: string;
   onTouched?: () => void;
}

function getFileNameFromUrl(url: string) {
   try {
      const p = new URL(url).pathname;
      return decodeURIComponent(p.split("/").pop() || "image");
   } catch {
      return "image";
   }
}

export function ImageUploadField({
   label,
   file,
   existingUrl = null,
   onChange,
   accept = "image/png,image/jpeg,image/jpg,image/webp",
   maxSizeMb = 4,
   errorText,
   onTouched,
}: Props) {
   const inputId = React.useId();
   const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

   React.useEffect(() => {
      if (!file) {
         setPreviewUrl(null);
         return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
   }, [file]);

   const effectivePreview = previewUrl || existingUrl;

   const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = e.target.files?.[0] ?? null;
      onTouched?.();
      if (!picked) return;
      onChange(picked);
      e.target.value = "";
   };

   const handleRemove = () => {
      onTouched?.();
      onChange(null);
   };

   return (
      <Stack spacing={1.25}>
         <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222222" }}>{label}</Typography>

         <Paper
            variant="outlined"
            sx={{
               borderWidth: "2px",
               borderStyle: "dashed",
               borderColor: errorText ? "#d32f2f" : "#000000",
               borderRadius: 1,
               p: 2,
               minHeight: 140,
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               bgcolor: "#fff",
            }}
         >
            <Stack spacing={1} alignItems="center">
               <CloudUploadOutlinedIcon sx={{ fontSize: 46, color: "#0A2E6E" }} />
               <input id={inputId} type="file" accept={accept} onChange={handlePick} hidden />
               <Button
                  component="label"
                  htmlFor={inputId}
                  variant="contained"
                  size="small"
                  sx={{
                     bgcolor: "#0A2E6E",
                     textTransform: "none",
                     borderRadius: 1.5,
                     fontWeight: 400,
                     px: 2.25,
                     "&:hover": { bgcolor: "#082657" },
                  }}
               >
                  Browse
               </Button>

               <Typography sx={{ fontSize: 12, color: "#888888", fontWeight: 400 }}>Drag a file to upload</Typography>
            </Stack>
         </Paper>

         {!!errorText && <FormHelperText error>{errorText}</FormHelperText>}

         <Stack direction="row" justifyContent="space-between" sx={{ width: "100%", mt: 1 }}>
            <Typography sx={{ fontSize: 12, color: "#888888", fontWeight: 400 }}>Accepted: JPG, PNG, WEBP</Typography>
            <Typography sx={{ fontSize: 12, color: "#888888", fontWeight: 400 }}>
               Maximum file size: {maxSizeMb}MB
            </Typography>
         </Stack>

         {(file || existingUrl) && (
            <Paper
               variant="outlined"
               sx={{
                  borderRadius: 2,
                  px: 1.25,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
               }}
            >
               <Box
                  sx={{
                     width: 44,
                     height: 34,
                     borderRadius: 1,
                     overflow: "hidden",
                     bgcolor: "#F2F4F7",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     flexShrink: 0,
                  }}
               >
                  {effectivePreview ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img
                        src={effectivePreview}
                        alt={file?.name || "existing image"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                     />
                  ) : null}
               </Box>

               <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                     sx={{ fontSize: 12, fontWeight: 600, color: "#101828" }}
                     noWrap
                     title={file?.name || (existingUrl ? getFileNameFromUrl(existingUrl) : "")}
                  >
                     {file?.name || (existingUrl ? getFileNameFromUrl(existingUrl) : "")}
                  </Typography>

                  <Typography sx={{ fontSize: 11, color: "#888888" }}>
                     {file
                        ? `Size: ${formatBytes(file.size)} • Type: ${
                             (file.type || "").toUpperCase().replace("IMAGE/", "") || "—"
                          }`
                        : "Existing image"}
                  </Typography>
               </Box>

               <IconButton size="small" onClick={handleRemove} aria-label="remove file">
                  <DeleteOutlineIcon fontSize="small" color="warning" />
               </IconButton>
            </Paper>
         )}
      </Stack>
   );
}
