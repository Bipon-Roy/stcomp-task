import * as React from "react";
import { Card, CardContent, Divider, Stack, Typography, Box } from "@mui/material";

export default function ProfessionalFeePanel() {
   return (
      <Card
         variant="outlined"
         sx={{
            borderRadius: 0,
            border: "none",
            boxShadow: "0px 12px 28px rgba(17,14,10,0.25)",
         }}
      >
         <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#111827" }}>
               Professional Fee
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#888888", mt: 0.5 }}>
               Set a rate for your service
            </Typography>

            <Box sx={{ display: "grid", placeItems: "center", mt: 4 }}>
               <Typography
                  sx={{
                     fontSize: 32,
                     fontWeight: 500,
                     color: "#111827",
                     borderBottom: "2px solid #111827",
                     lineHeight: 1.1,
                     pb: 0.5,
                  }}
               >
                  RM 1,800
               </Typography>
            </Box>

            <Stack spacing={1.4} sx={{ mt: 4 }}>
               <FeeRow label="Base price" value="RM 1,800" />

               <FeeRow
                  label={
                     <Typography
                        component="span"
                        sx={{
                           textDecoration: "underline",
                           textDecorationColor: "#222222",
                           textUnderlineOffset: "3px",
                        }}
                     >
                        Service processing fee
                     </Typography>
                  }
                  value="RM 540"
               />

               <FeeRow label="Total" value="RM 2340" />
            </Stack>

            <Divider sx={{ my: 2.25 }} />

            <FeeRow
               label={<Typography sx={{ fontWeight: 700 }}>Your returns</Typography>}
               value={<Typography sx={{ fontWeight: 600, color: "#222222" }}>RM 1,800</Typography>}
            />
         </CardContent>
      </Card>
   );
}

function FeeRow(props: { label: React.ReactNode; value: React.ReactNode }) {
   return (
      <Stack direction="row" justifyContent="space-between" alignItems="center">
         <Typography variant="body2" sx={{ color: "#6B7280" }}>
            {props.label}
         </Typography>
         <Typography variant="body2" sx={{ color: "#111827", fontWeight: 700 }}>
            {props.value}
         </Typography>
      </Stack>
   );
}
