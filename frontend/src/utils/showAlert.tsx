import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createRoot, Root } from "react-dom/client";
import React, { useState } from "react";

let root: Root | null = null;

const AlertWrapper = ({
   message,
   severity,
}: {
   message: string;
   severity: "success" | "error" | "info" | "warning";
}) => {
   const [open, setOpen] = useState(true);

   const handleClose = () => {
      setOpen(false);
   };

   return (
      <Snackbar
         open={open}
         autoHideDuration={2000}
         onClose={handleClose}
         anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
         <Alert
            variant="filled"
            severity={severity}
            onClose={handleClose}
            action={
               <IconButton size="small" color="inherit" onClick={handleClose}>
                  <CloseIcon fontSize="small" />
               </IconButton>
            }
         >
            {message}
         </Alert>
      </Snackbar>
   );
};

export const showAlert = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
   if (!root) {
      const div = document.createElement("div");
      document.body.appendChild(div);
      root = createRoot(div);
   }

   root.render(<AlertWrapper message={message} severity={severity} />);
};
