"use client";

import * as React from "react";
import { Box, Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ServiceFormFields } from "./ServiceFormFields";
import { ServiceFormValues } from "@/types";

type Props = {
   open: boolean;
   onClose: () => void;
   mode?: "create" | "edit";
   initialValues: ServiceFormValues;
   onConfirm: (values: ServiceFormValues) => void;
   additionalOfferingOptions: string[];
};

export function ServiceEditDrawer({
   open,
   onClose,
   mode = "edit",
   initialValues,
   onConfirm,
   additionalOfferingOptions,
}: Props) {
   const [draft, setDraft] = React.useState<ServiceFormValues>(initialValues);

   React.useEffect(() => {
      if (open) setDraft(initialValues);
   }, [open, initialValues]);

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
               value={draft}
               onChange={setDraft}
               additionalOfferingOptions={additionalOfferingOptions}
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
                  fullWidth
                  variant="contained"
                  onClick={() => onConfirm(draft)}
                  sx={{
                     textTransform: "none",
                     borderRadius: 1.5,
                     fontWeight: 400,
                     bgcolor: "#0A2E6E",
                     "&:hover": { bgcolor: "#082657" },
                  }}
               >
                  Confirm
               </Button>
            </Stack>
         </Box>
      </Drawer>
   );
}
