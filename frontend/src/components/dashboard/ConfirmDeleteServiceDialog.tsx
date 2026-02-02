import * as React from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Stack,
   Typography,
   IconButton,
   CircularProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useDeleteRequest } from "@/hooks/useMutation";

interface ConfirmDeleteDialogProps {
   open: boolean;
   serviceId: string | null;
   serviceTitle?: string;
   onClose: () => void;
}

export default function ConfirmDeleteDialog({ open, serviceId, serviceTitle, onClose }: ConfirmDeleteDialogProps) {
   const { mutate: deleteService, isPending } = useDeleteRequest(
      "Delete_Service",
      "/specialist",
      "All_Specialists_Dashboard"
   );

   const handleConfirm = () => {
      if (!serviceId) return;
      deleteService(serviceId, {
         onSuccess: () => onClose(),
      });
   };

   const handleClose = () => {
      if (isPending) return;
      onClose();
   };

   return (
      <Dialog
         open={open}
         onClose={handleClose}
         maxWidth="sm"
         fullWidth
         aria-labelledby="delete-service-title"
         slotProps={{
            backdrop: {
               sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
               },
            },
            paper: {
               sx: {
                  borderRadius: 2.5,
                  overflow: "hidden",
                  border: "1px solid #EEF2F7",
               },
            },
         }}
      >
         {/* Header */}
         <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
               px: 2.25,
               py: 1.75,
               bgcolor: "#FFF5F5",
            }}
         >
            <Stack direction="row" spacing={1.25} alignItems="center">
               <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                     width: 36,
                     height: 36,
                     borderRadius: 2,
                     bgcolor: "#FEE2E2",
                     color: "#B91C1C",
                  }}
               >
                  <WarningAmberRoundedIcon fontSize="small" />
               </Stack>

               <DialogTitle id="delete-service-title" sx={{ p: 0, fontWeight: 600, fontSize: 20, color: "#111827" }}>
                  Delete Specialist
               </DialogTitle>
            </Stack>

            <IconButton
               onClick={handleClose}
               disabled={isPending}
               size="small"
               sx={{
                  color: "#6B7280",
                  "&:hover": { bgcolor: "rgba(17,24,39,0.06)" },
               }}
               aria-label="Close"
            >
               <CloseRoundedIcon />
            </IconButton>
         </Stack>

         {/* Body */}
         <DialogContent sx={{ px: 2.25, py: 2 }}>
            <Typography variant="body2" sx={{ color: "#374151", mb: 1 }}>
               You’re about to delete <span className="font-medium">{serviceTitle}</span>
            </Typography>

            <Typography variant="body2" sx={{ color: "#6B7280", mt: 1.25 }}>
               It will be removed from your list and can’t be restored.
            </Typography>
         </DialogContent>

         {/* Actions */}
         <DialogActions sx={{ px: 2.25, py: 1.75 }}>
            <Button
               onClick={handleClose}
               disabled={isPending}
               variant="outlined"
               sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  borderColor: "#E5E7EB",
                  color: "#111827",
                  "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
               }}
            >
               Cancel
            </Button>

            <Button
               onClick={handleConfirm}
               disabled={isPending || !serviceId}
               variant="contained"
               sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2.5,
                  fontWeight: 600,
                  bgcolor: "#CE2029",
                  "&:hover": { bgcolor: "#990000" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "none",
               }}
            >
               {isPending ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                     <CircularProgress size={18} sx={{ color: "#000" }} />
                     <span className="animate-pulse text-black">Deleting…</span>
                  </Stack>
               ) : (
                  "Delete"
               )}
            </Button>
         </DialogActions>
      </Dialog>
   );
}
