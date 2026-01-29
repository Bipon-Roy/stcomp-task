import SpecialistTabs from "@/components/dashboard/SpecialistTabs";
import { Box, Stack, Typography } from "@mui/material";

export default function SpecialistsPage() {
   return (
      <>
         <Stack spacing={0.5} sx={{ mt: 1, p: 2 }}>
            <Typography
               variant="subtitle2"
               sx={{ color: "#454545", letterSpacing: 0.3, fontSize: 14, fontWeight: 500 }}
            >
               Dashboard
            </Typography>
            <Typography variant="h5" sx={{ color: "#252525", letterSpacing: 0.3, fontWeight: 600 }}>
               Services
            </Typography>
         </Stack>

         <Box sx={{ py: 2, px: { xs: 1, md: 6 }, bgcolor: "#FFF" }}>
            <Stack spacing={1} sx={{ mt: 1 }}>
               <Typography variant="h4" sx={{ color: "#000000", letterSpacing: 0.3, fontWeight: 600 }}>
                  Specialists
               </Typography>
               <Typography variant="caption" sx={{ color: "#888888", letterSpacing: 0.3 }}>
                  Create and publish your services for Client&apos;s & Companies
               </Typography>
            </Stack>
            <SpecialistTabs />
         </Box>
      </>
   );
}
