"use client";

import { Box, Button, CircularProgress, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ServiceFormFields } from "./ServiceFormFields";
import { ServiceFormErrors } from "@/hooks/useServiceForm";
import { useEffect } from "react";
import { useGetRequest } from "@/hooks/useGetRequest";
import { SpecialistById } from "@/types";

import { type CreateSpecialistFormValues, type UpdateSpecialistFormValues } from "@/validators/specialist.validator";

type DrawerMode = "edit" | "create";

type FormValuesByMode = {
   create: CreateSpecialistFormValues;
   edit: UpdateSpecialistFormValues;
};

interface Props<M extends DrawerMode = DrawerMode> {
   open: boolean;
   isPending: boolean;
   serviceId?: string;
   onClose: () => void;
   mode: M;

   value: FormValuesByMode[M];
   errors?: ServiceFormErrors;
   additionalOfferingOptions: string[];

   onChange: (next: FormValuesByMode[M]) => void;
   onTouched?: (key: string) => void;
   onConfirm: () => void;
}

function normalizeStatus(s: unknown): "under-review" | "approved" | "rejected" {
   if (s === "under-review" || s === "approved" || s === "rejected") return s;
   // if API returns something like "pending", map it safely
   return "under-review";
}

function mapApiToUpdateFormValues(d: SpecialistById): UpdateSpecialistFormValues {
   return {
      title: d?.title ?? "",
      description: d?.description ?? "",
      status: normalizeStatus(d?.approvalStatus),
      estimatedDays: Number(d?.durationDays ?? 1),
      additionalOfferings: d?.additionalOfferings ?? [],
      price: d?.price ?? "",

      // update schema fields (optional replacements)
      image0: null,
      image1: null,
      image2: null,
   };
}

export function ServiceEditDrawer<M extends DrawerMode>({
   open,
   onClose,
   onConfirm,
   mode,
   serviceId = "",
   value,
   errors,
   onChange,
   onTouched,
   additionalOfferingOptions,
   isPending,
}: Props<M>) {
   const enabled = open && Boolean(serviceId) && mode === "edit";

   const { data, isFetching } = useGetRequest(
      ["Specialist_By_Id", serviceId],
      `/specialist/${serviceId}`,
      undefined,
      enabled
   );

   useEffect(() => {
      if (!enabled) return;
      if (!data) return;

      // only runs in edit mode; cast is safe due to enabled guard
      (onChange as (next: UpdateSpecialistFormValues) => void)(mapApiToUpdateFormValues(data));
   }, [data, enabled, onChange]);

   const title = mode === "create" ? "Create Service" : "Edit Service";
   const confirmText = mode === "create" ? "Create" : "Update";

   return (
      <Drawer
         anchor="right"
         open={open}
         onClose={onClose}
         slotProps={{ paper: { sx: { width: { xs: "100%", sm: 450 } } } }}
      >
         {/* Header */}
         <Box sx={{ py: 2, px: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
               <Typography variant="h5" sx={{ fontWeight: 500, color: "#000" }}>
                  {title}
               </Typography>
               <IconButton onClick={onClose} aria-label="close">
                  <CloseIcon />
               </IconButton>
            </Stack>
         </Box>

         {/* Body */}
         <Box sx={{ py: 2, px: 3, overflowY: "auto", flex: 1 }}>
            {isFetching ? (
               <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
                  <CircularProgress size={28} />
                  <Typography color="text.secondary">Loading service details…</Typography>
               </Stack>
            ) : (
               <ServiceFormFields
                  value={value as any}
                  onChange={onChange as any}
                  additionalOfferingOptions={additionalOfferingOptions}
                  errors={errors}
                  onTouched={onTouched}
                  existingImageUrls={data?.media}
                  mode={mode}
               />
            )}
         </Box>

         {/* Footer */}
         <Box sx={{ py: 2, px: 3 }}>
            <Stack direction="row" spacing={1.25}>
               <Button
                  fullWidth
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                     textTransform: "none",
                     borderRadius: 1.5,
                     borderColor: "#D0D5DD",
                     color: "#D92D20",
                     "&:hover": { borderColor: "#D92D20", bgcolor: "transparent" },
                  }}
               >
                  Cancel
               </Button>

               <Button
                  disabled={isPending || isFetching}
                  fullWidth
                  variant="contained"
                  onClick={onConfirm}
                  sx={{
                     textTransform: "none",
                     borderRadius: 1.5,
                     fontWeight: 400,
                     bgcolor: "#0A2E6E",
                     "&:hover": { bgcolor: "#082657" },
                  }}
               >
                  {isPending ? (
                     <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} sx={{ color: "#fff" }} />
                        <span className="animate-pulse text-white">Please wait…</span>
                     </Stack>
                  ) : (
                     confirmText
                  )}
               </Button>
            </Stack>
         </Box>
      </Drawer>
   );
}
