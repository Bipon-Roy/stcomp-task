import * as React from "react";
import { Dialog, DialogContent, Stack, Typography, Button, CircularProgress, Box } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

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
            paper: {
               sx: {
                  borderRadius: 2,
                  overflow: "hidden",
               },
            },
         }}
      >
         <DialogContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="start">
               <Box sx={{ pt: 0.5 }}>
                  <ErrorOutlineRoundedIcon />
               </Box>

               <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#222222" }}>
                     Publish changes
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
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
                              <CircularProgress size={18} sx={{ color: "#fff" }} />
                              <span>Saving…</span>
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
