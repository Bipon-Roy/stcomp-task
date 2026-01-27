"use client";

import * as React from "react";
import { Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Props = {
   label: string;
   file: File | null;
   onChange: (file: File | null) => void;
   accept?: string;
   maxSizeMb?: number;
};

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

export function ImageUploadField({
   label,
   file,
   onChange,
   accept = "image/png,image/jpeg,image/jpg,image/webp",
   maxSizeMb = 4,
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

   const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = e.target.files?.[0] ?? null;
      if (!picked) return;

      const maxBytes = maxSizeMb * 1024 * 1024;
      if (picked.size > maxBytes) {
         // basic guard; hook your toast/snackbar if you want
         onChange(null);
         e.target.value = "";
         return;
      }

      onChange(picked);
      e.target.value = "";
   };

   return (
      <Stack spacing={1.25}>
         <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#222" }}>{label}</Typography>

         {/* Dropzone-like box */}
         <Paper
            variant="outlined"
            sx={{
               borderStyle: "dashed",
               borderColor: "#C7CDD6",
               borderRadius: 2,
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

               <Typography sx={{ fontSize: 11, color: "#667085" }}>Drag a file to upload</Typography>

               <Stack direction="row" justifyContent="space-between" sx={{ width: "100%", mt: 1 }}>
                  <Typography sx={{ fontSize: 10, color: "#667085" }}>Accepted: JPG, PNG, WEBP</Typography>
                  <Typography sx={{ fontSize: 10, color: "#667085" }}>Max: {maxSizeMb}MB</Typography>
               </Stack>
            </Stack>
         </Paper>

         {/* File card */}
         {file && (
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
                  {previewUrl ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img
                        src={previewUrl}
                        alt={file.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                     />
                  ) : null}
               </Box>

               <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                     sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#101828",
                     }}
                     noWrap
                     title={file.name}
                  >
                     {file.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#667085" }}>
                     Size: {formatBytes(file.size)} • Type:{" "}
                     {(file.type || "").toUpperCase().replace("IMAGE/", "") || "—"}
                  </Typography>
               </Box>

               <IconButton size="small" onClick={() => onChange(null)} aria-label="remove file">
                  <DeleteOutlineIcon fontSize="small" />
               </IconButton>
            </Paper>
         )}
      </Stack>
   );
}
