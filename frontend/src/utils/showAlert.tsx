import { Snackbar, Alert } from "@mui/material";
import { createRoot, Root } from "react-dom/client";

let root: Root | null = null;

export const showAlert = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
   if (!root) {
      const div = document.createElement("div");
      document.body.appendChild(div);
      root = createRoot(div);
   }

   root.render(
      <Snackbar open autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
         <Alert variant="filled" severity={severity}>
            {message}
         </Alert>
      </Snackbar>
   );
};
