"use client";

import { Box, Button, CircularProgress, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ServiceFormFields } from "./ServiceFormFields";
import { ServiceFormValues } from "@/validators/specialist.validator";
import { ServiceFormErrors } from "@/hooks/useServiceForm";

interface Props {
   open: boolean;
   isPending: boolean;
   onClose: () => void;
   mode: "edit" | "create";
   value: ServiceFormValues;
   errors?: ServiceFormErrors;
   additionalOfferingOptions: string[];
   onChange: (next: ServiceFormValues) => void;
   onTouched?: (key: string) => void;
   onConfirm: () => void;
}

export function ServiceEditDrawer({
   open,
   onClose,
   mode = "edit",
   onChange,
   errors,
   onTouched,
   value,
   onConfirm,
   additionalOfferingOptions,
   isPending,
}: Props) {
   const title = mode === "create" ? "Create Service" : "Edit Service";

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
         <Box sx={{ py: 2, px: 3, overflowY: "auto" }}>
            <ServiceFormFields
               value={value}
               onChange={onChange}
               additionalOfferingOptions={additionalOfferingOptions}
               errors={errors}
               onTouched={onTouched}
            />
         </Box>

         {/* Footer */}
         <Box sx={{ py: 2, px: 3, mt: "auto" }}>
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
                  disabled={isPending}
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
                        <CircularProgress size={25} sx={{ color: "#000" }} />
                        <span className="animate-pulse text-black">Please wait…</span>
                     </Stack>
                  ) : (
                     "Confirm"
                  )}
               </Button>
            </Stack>
         </Box>
      </Drawer>
   );
}
