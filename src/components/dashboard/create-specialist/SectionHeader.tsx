import * as React from "react";
import { Stack, Typography } from "@mui/material";

export default function SectionHeader(props: { title: string; subtitle?: string }) {
   return (
      <Stack spacing={0.5}>
         <Typography variant="h5" sx={{ fontWeight: 600, color: "#222222", mb: 2 }}>
            {props.title}
         </Typography>
         {props.subtitle ? (
            <Typography variant="body2" sx={{ color: "#888888" }}>
               {props.subtitle}
            </Typography>
         ) : null}
      </Stack>
   );
}
