"use client";

import ProfessionalFeePanel from "@/components/dashboard/create-specialist/ProfessionalFeePanel";
import { ServiceEditDrawer } from "@/components/dashboard/create-specialist/ServiceEditDrawer";
import ServiceLeftPanel from "@/components/dashboard/create-specialist/ServiceLeftPanel";
import { ServicePublishModal } from "@/components/dashboard/ServicePublishModal";
import { usePost, usePostWithFormData } from "@/hooks/useMutation";
import { useServiceForm } from "@/hooks/useServiceForm";
import { buildServiceFormData } from "@/services/specialistPayload";
import { serviceOptions } from "@/utils/serviceOffers";
import { showAlert } from "@/utils/showAlert";
import { CreateSpecialistFormValues } from "@/validators/specialist.validator";
import { Stack, Typography, Button, Grid } from "@mui/material";
import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const initialValues: CreateSpecialistFormValues = {
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
   const [publishDialogOpen, setPublishDialogOpen] = useState(false);
   const form = useServiceForm("create", initialValues);
   const { mutate: createSpecialist, isPending } = usePostWithFormData("Create_Specialist", "/specialist");
   const [createdServiceId, setCreatedServiceId] = useState(null);
   const queryClient = useQueryClient();
   const { mutate: publishSpecialist, isPending: isPublishPending } = usePost(
      "Publish_Specialist",
      "/specialist/publish"
   );
   const handleCreateSpecialist = () => {
      const r = form.validateAll();

      if (!r.ok) return;

      const payload = buildServiceFormData(form.value);
      createSpecialist(payload, {
         onSuccess: (data) => {
            if (data) setCreatedServiceId(data.data.id);
            queryClient.invalidateQueries({ queryKey: ["All_Specialists_Dashboard"] });
            setDrawerOpen(false);
         },
      });
   };

   const handlePublishClick = () => {
      if (!createdServiceId) return showAlert("Service must be created first before publish!", "error");
      setPublishDialogOpen(true);
   };

   const handleConfirmPublish = () => {
      if (!createdServiceId) return;

      publishSpecialist(
         { serviceId: createdServiceId },
         {
            onSuccess: () => {
               setPublishDialogOpen(false);
            },
         }
      );
   };
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
                  disabled={isPending || isPublishPending}
                  onClick={handlePublishClick}
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
            mode="create"
            isPending={isPending}
            value={form.value}
            errors={form.errors}
            onTouched={form.onTouched}
            onChange={form.onChange}
            additionalOfferingOptions={serviceOptions}
            onConfirm={handleCreateSpecialist}
         />

         <ServicePublishModal
            open={publishDialogOpen}
            onClose={() => setPublishDialogOpen(false)}
            onConfirm={handleConfirmPublish}
            loading={isPublishPending}
         />
      </Box>
   );
}
