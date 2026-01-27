import * as React from "react";
import { Card, CardContent, Divider, Stack, Typography, Box } from "@mui/material";

export default function ProfessionalFeePanel() {
   return (
      <Card
         variant="outlined"
         sx={{
            borderRadius: 0,
            border: "none",
            boxShadow: "0px 12px 28px rgba(17,14,8,0.15)",
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
               <div className="flex items-center justify-between font-medium">
                  <p className="text-[#454545]">Base price</p>
                  <p className="text-[#222222]">RM 1,800</p>
               </div>
               <div className="flex items-center justify-between font-medium">
                  <p className="text-[#454545]">Service processing fee</p>
                  <p className="text-[#222222]">RM 540</p>
               </div>
               <div className="flex items-center justify-between font-medium">
                  <p className="text-[#454545]">Total</p>
                  <p className="text-[#222222]">RM 2340</p>
               </div>
            </Stack>

            <Divider sx={{ my: 2.25 }} />

            <div className="flex items-center justify-between font-medium">
               <p className="text-[#454545]">Your returns</p>
               <p className="text-[#222222]">RM 1,800</p>
            </div>
         </CardContent>
      </Card>
   );
}
