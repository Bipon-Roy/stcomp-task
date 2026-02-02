import * as React from "react";
import { Dialog, DialogContent, Stack, Typography, Button, CircularProgress, Box } from "@mui/material";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";

interface Props {
   open: boolean;
   onClose: () => void;
   onConfirm: () => void;
   loading?: boolean;
}

export function ServicePublishModal({ open, onClose, onConfirm, loading = false }: Props) {
   return (
      <Dialog
         open={open}
         onClose={loading ? undefined : onClose}
         maxWidth="sm"
         fullWidth
         slotProps={{
            backdrop: {
               sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
               },
            },
            paper: {
               sx: {
                  borderRadius: 2,
                  overflow: "hidden",
               },
            },
         }}
      >
         <DialogContent sx={{ px: 2, py: 3 }}>
            <Stack direction="row" spacing={1} alignItems="start">
               <Box sx={{ pt: 0.5 }}>
                  <InfoSharpIcon
                     sx={{
                        color: "#071331",
                        fontSize: 30,
                     }}
                  />
               </Box>

               <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: "#222222", fontSize: 30 }}>
                     Publish changes
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#454545", mt: 0.5 }}>
                     Do you want to publish these changes? It will appear in the marketplace listing
                  </Typography>

                  <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
                     <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                        sx={{
                           textTransform: "none",
                           px: 3,
                           borderRadius: 1.5,
                           color: "#222222",
                           borderColor: "#222222",
                        }}
                     >
                        Continue Editing
                     </Button>

                     <Button
                        variant="contained"
                        onClick={onConfirm}
                        disabled={loading}
                        sx={{
                           textTransform: "none",
                           px: 3,
                           borderRadius: 1.5,
                           bgcolor: "#002F70",
                           "&:hover": { bgcolor: "#082555" },
                        }}
                     >
                        {loading ? (
                           <Stack direction="row" spacing={1} alignItems="center">
                              <CircularProgress size={18} sx={{ color: "#000" }} />
                              <span className="animate-pulse text-black">Saving…</span>
                           </Stack>
                        ) : (
                           "Save changes"
                        )}
                     </Button>
                  </Stack>
               </Box>
            </Stack>
         </DialogContent>
      </Dialog>
   );
}
