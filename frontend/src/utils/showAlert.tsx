import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createRoot, Root } from "react-dom/client";
import React, { useEffect, useState } from "react";

let root: Root | null = null;
let hostEl: HTMLDivElement | null = null;
let counter = 0;

const AlertWrapper = ({
   message,
   severity,
   onDone,
}: {
   message: string;
   severity: "success" | "error" | "info" | "warning";
   onDone: () => void;
}) => {
   const [open, setOpen] = useState(true);

   const handleClose = () => {
      setOpen(false);
   };

   // When snackbar finishes closing, notify util so it can unmount.
   useEffect(() => {
      if (!open) {
         // let the exit animation finish first
         const t = setTimeout(onDone, 200);
         return () => clearTimeout(t);
      }
   }, [open, onDone]);

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
               <IconButton size="small" color="inherit" onClick={() => handleClose()}>
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
   if (typeof window === "undefined") return;

   if (!root) {
      hostEl = document.createElement("div");
      document.body.appendChild(hostEl);
      root = createRoot(hostEl);
   }

   const id = ++counter;

   const cleanup = () => {
      // unmount content to remove stale state
      root?.render(<></>);
   };

   root.render(
      <AlertWrapper
         key={id} // ✅ forces remount every time
         message={message}
         severity={severity}
         onDone={cleanup}
      />
   );
};
