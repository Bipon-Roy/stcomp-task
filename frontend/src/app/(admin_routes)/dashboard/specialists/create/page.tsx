"use client";

import ProfessionalFeePanel from "@/components/dashboard/create-specialist/ProfessionalFeePanel";
import { ServiceEditDrawer } from "@/components/dashboard/create-specialist/ServiceEditDrawer";
import ServiceLeftPanel from "@/components/dashboard/create-specialist/ServiceLeftPanel";
import { usePostWithFormData } from "@/hooks/useMutation";
import { useServiceForm } from "@/hooks/useServiceForm";
import { buildServiceFormData } from "@/services/specialistPayload";
import { serviceOptions } from "@/utils/serviceOffers";
import { ServiceFormValues } from "@/validators/specialist.validator";
import { Stack, Typography, Button, Grid } from "@mui/material";
import { Box } from "@mui/material";
import { useState } from "react";

const initialValues: ServiceFormValues = {
   title: "",
   description: "",
   status: "approved",
   estimatedDays: 1,
   price: "",
   additionalOfferings: [],
   images: [null, null, null],
};

export default function CreateSpecialistPage() {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const form = useServiceForm(initialValues);
   const { mutate, isPending } = usePostWithFormData("Create_Specialist", "/specialist/create");
   const [createdServiceId, setCreatedServiceId] = useState(null);
   return (
      <Box sx={{ mt: 1, p: 2, bgcolor: "#fff" }}>
         <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
         >
            <Typography variant="h4" sx={{ fontWeight: 500, color: "#222222" }}>
               Register a new company | Private Limited - Sdn Bhd
            </Typography>

            <Stack direction="row" spacing={1.25}>
               <Button
                  variant="contained"
                  onClick={() => setDrawerOpen(true)}
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
                  variant="contained"
                  onClick={() => {
                     const r = form.validateAll();
                     if (!r.ok) {
                        setDrawerOpen(true);
                        return;
                     }
                  }}
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
               <ServiceLeftPanel data={form.value} />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
               <Box>
                  <ProfessionalFeePanel data={form.value} />
               </Box>
            </Grid>
         </Grid>

         <ServiceEditDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            mode="edit"
            isPending={isPending}
            value={form.value}
            errors={form.errors}
            onTouched={form.onTouched}
            onChange={form.onChange}
            additionalOfferingOptions={serviceOptions}
            onConfirm={() => {
               const r = form.validateAll();

               if (!r.ok) return;

               const payload = buildServiceFormData(form.value);
               mutate(payload, {
                  onSuccess: (data) => {
                     console.log(data);
                     setDrawerOpen(false);
                  },
               });
            }}
         />
      </Box>
   );
}
