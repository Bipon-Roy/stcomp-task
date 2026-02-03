import * as React from "react";
import { Box, Breadcrumbs, Container, Stack, Typography, IconButton } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Navbar from "@/components/navbar/Navbar";
import SpecialistCard from "@/components/ui/SpecialistCard";

export default function Home() {
   return (
      <>
         <Navbar />

         <Container maxWidth={false} sx={{ maxWidth: "1720px", mt: 5 }}>
            <Box>
               {/* Breadcrumb */}
               <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <IconButton
                     size="small"
                     aria-label="home"
                     sx={{
                        color: "#002F70",
                        "&:hover": { bgcolor: "transparent" },
                        p: 0.5,
                     }}
                  >
                     <HomeRoundedIcon fontSize="small" />
                  </IconButton>

                  <Breadcrumbs
                     separator="/"
                     aria-label="breadcrumb"
                     sx={{
                        "& .MuiBreadcrumbs-separator": { mx: 1.25, color: "text.disabled" },
                     }}
                  >
                     <Typography sx={{ color: "#454545", fontWeight: 400 }}>Specialists</Typography>
                     <Typography sx={{ color: "#454545", fontWeight: 500 }}>Register a New Company</Typography>
                  </Breadcrumbs>
               </Stack>

               {/* Title + subtitle */}
               <Typography
                  variant="h5"
                  sx={{
                     fontWeight: 600,
                  }}
               >
                  Register a New Company
               </Typography>

               <Typography
                  variant="caption"
                  sx={{
                     color: "text.secondary",
                     maxWidth: 820,
                  }}
               >
                  Get Your Company Registered with a Trusted Specialists
               </Typography>

               {/* Filters */}
               <div className="mt-2 flex w-full max-w-62 flex-col gap-2 sm:flex-row">
                  {/* Price */}
                  <select
                     defaultValue=""
                     className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  >
                     <option value="" disabled>
                        Price
                     </option>
                     <option value="lowToHigh">Low to High</option>
                     <option value="highToLow">High to Low</option>
                  </select>

                  {/* Sort by */}
                  <select
                     defaultValue=""
                     className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  >
                     <option value="" disabled>
                        Sort by
                     </option>
                     <option value="newest">Newest</option>
                     <option value="popular">Popular</option>
                  </select>
               </div>
            </Box>
            <SpecialistCard />
         </Container>
      </>
   );
}
