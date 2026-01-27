import ProfessionalFeePanel from "@/components/dashboard/create-specialist/ProfessionalFeePanel";
import ServiceLeftPanel from "@/components/dashboard/create-specialist/ServiceLeftPanel";
import { Stack, Typography, Button, Grid } from "@mui/material";
import { Box } from "@mui/material";

export default function CreateSpecialistPage() {
   return (
      <Box sx={{ mt: 1, p: 2, bgcolor: "#fff" }}>
         <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
         >
            <Typography
               variant="h4"
               sx={{
                  fontWeight: 500,
                  color: "#222222",
               }}
            >
               Register a new company | Private Limited - Sdn Bhd
            </Typography>

            <Stack direction="row" spacing={1.25}>
               <Button
                  variant="contained"
                  sx={{
                     bgcolor: "#071331",
                     px: 5,
                     borderRadius: 1.5,
                     textTransform: "none",
                     "&:hover": { bgcolor: "#001737" },
                  }}
               >
                  Edit
               </Button>
               <Button
                  href="/dashboard/specialists/create"
                  variant="contained"
                  sx={{
                     bgcolor: "#002F70",
                     px: 5,
                     borderRadius: 1.5,
                     textTransform: "none",
                     "&:hover": { bgcolor: "#00265C" },
                  }}
               >
                  Publish
               </Button>
            </Stack>
         </Stack>
         <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, lg: 8 }}>
               <ServiceLeftPanel />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
               <Box>
                  <ProfessionalFeePanel />
               </Box>
            </Grid>
         </Grid>
      </Box>
   );
}
