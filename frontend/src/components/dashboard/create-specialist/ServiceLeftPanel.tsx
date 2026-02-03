import * as React from "react";
import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import SectionHeader from "./SectionHeader";
import VerifiedIcon from "@mui/icons-material/Verified";
import Image from "next/image";
import { useObjectUrl } from "@/components/ui/ImagePreviewer";
import { CreateSpecialistFormValues } from "@/validators/specialist.validator";

interface Props {
   data: CreateSpecialistFormValues;
}
export default function ServiceLeftPanel({ data }: Props) {
   const img1Url = useObjectUrl((data.images?.[0] as File) ?? null);
   const img2Url = useObjectUrl((data.images?.[1] as File) ?? null);
   const img3Url = useObjectUrl((data.images?.[2] as File) ?? null);
   return (
      <Stack spacing={3} sx={{ mb: 2 }}>
         <Grid container spacing={2}>
            {/* Upload placeholder */}
            <Grid size={{ xs: 12, md: 7 }}>
               {img1Url ? (
                  <>
                     <div className="relative w-full h-full">
                        {/* ← or h-full, h-screen, aspect-video, etc. */}
                        <Image src={img1Url} alt="ServiceImage" fill priority className="object-fill" />
                     </div>
                  </>
               ) : (
                  <Paper
                     variant="outlined"
                     sx={{
                        height: { xs: 240, md: "100%" },
                        borderRadius: 0,
                        borderColor: "#E5E7EB",
                        bgcolor: "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                     }}
                  >
                     <Stack spacing={1} alignItems="center" sx={{ textAlign: "center" }}>
                        <Box sx={{ color: "#9CA3AF" }}>
                           <CropFreeOutlinedIcon sx={{ fontSize: 44 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: "#9CA3AF", maxWidth: 260, lineHeight: 1.4 }}>
                           Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                        </Typography>
                     </Stack>
                  </Paper>
               )}
            </Grid>

            {/* Banners */}
            <Grid size={{ xs: 12, md: 5 }}>
               <Stack spacing={0.5}>
                  <Image src={img2Url || "/service1.png"} alt="ServiceImage" width={400} height={250} priority />
                  <Image src={img3Url || "/service2.png"} alt="ServiceImage" width={400} height={250} priority />
               </Stack>
            </Grid>
         </Grid>

         <Box>
            <SectionHeader title="Description" subtitle={data.description ?? "Describe your service here"} />
            <Divider sx={{ mt: 2 }} />
         </Box>

         <Box>
            {data.additionalOfferings.length ? (
               <>
                  <SectionHeader title="Additional Offerings" />
                  <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: "wrap", gap: 1.5 }}>
                     {data.additionalOfferings.map((offering, index) => (
                        <Chip
                           key={index}
                           label={offering}
                           size="medium"
                           sx={{
                              bgcolor: "#F3F4F6",
                              color: "#374151",
                              fontWeight: 500,
                              borderRadius: "16px",
                              px: 1,
                              "& .MuiChip-label": {
                                 px: 1.5,
                                 py: 0.5,
                              },
                           }}
                        />
                     ))}
                  </Stack>
               </>
            ) : (
               <SectionHeader
                  title="Additional Offerings"
                  subtitle="Enhance your service by adding additional offerings"
               />
            )}

            <Divider sx={{ mt: 2 }} />
         </Box>

         <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#222222", mb: 2 }}>
               Company Secretary
            </Typography>

            <Grid container spacing={3} justifyContent="start">
               {/* Left card */}
               <Grid size={{ xs: 12, md: 7 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                     <Avatar src="/serviceAvatar.png" sx={{ width: 100, height: 100 }} />
                     <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <Typography variant="h6" sx={{ fontWeight: 500, color: "#222222" }}>
                              Grace Lam
                           </Typography>
                           <Stack direction="row" spacing={0.5} alignItems="center">
                              <VerifiedIcon fontSize="small" sx={{ color: "#16A34A" }} />
                              <Typography sx={{ color: "#16A34A", fontWeight: 600 }}>Verified</Typography>
                           </Stack>
                        </Stack>

                        <Typography variant="body1" sx={{ color: "#454545", fontWeight: 500 }}>
                           Corpsec Services Sdn Bhd
                        </Typography>

                        <Button
                           variant="contained"
                           sx={{
                              bgcolor: "#071331",
                              px: 3.5,
                              mt: 1,
                              fontWeight: 400,
                              borderRadius: 1.5,
                              textTransform: "none",
                              "&:hover": { bgcolor: "#001737" },
                           }}
                        >
                           View Profile
                        </Button>
                     </Box>
                  </Stack>

                  <Typography variant="inherit" sx={{ mt: 4, color: "#454545", lineHeight: 1.5, fontWeight: 500 }}>
                     A company secretarial service founded by Aida, who believes that every company deserves clarity,
                     confidence, and care in their compliance journey. Inspired by the spirit of entrepreneurship, Aida
                     treats every client&apos;s business as if it were her own attentive to details, committed to
                     deadlines, and focused on results. Step into a partnership where your registrations, renewals, and
                     governance stay on track. Whether you&apos;re just starting out or managing a growing company, Aida
                     is here to make your corporate processes smooth, secure, and stress-free.
                  </Typography>
               </Grid>

               {/* Right info column */}
               <Grid size={{ xs: 12, md: 5 }}>
                  <Box>
                     <Typography variant="h5" sx={{ fontWeight: 500, color: "#111827", mb: 1 }}>
                        Certified Company Secretary
                     </Typography>

                     <Stack direction="row" spacing={4} alignItems="start">
                        <Image src="/certified1.png" alt="Certified Company Logo" width={100} height={30} priority />
                        <Image src="/certified2.png" alt="Certified Company Logo" width={100} height={30} priority />
                        <Image src="/certified3.png" alt="Certified Company Logo" width={50} height={30} priority />
                     </Stack>
                  </Box>
               </Grid>
            </Grid>
         </Box>
      </Stack>
   );
}
