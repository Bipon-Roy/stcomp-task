"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { DashboardNavbar } from "./DashboardNavbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
   const isMobile = useIsMobile();
   const [sidebarOpen, setSidebarOpen] = React.useState(false);

   return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f7fa", display: "flex" }}>
         {/* Sidebar */}
         <DashboardSidebar open={isMobile ? sidebarOpen : true} onClose={() => setSidebarOpen(false)} />

         {/* Right side (Navbar + Content) */}
         <Box
            sx={{
               flexGrow: 1,
               minWidth: 0,
               display: "flex",
               flexDirection: "column",
            }}
         >
            <DashboardNavbar onOpenSidebar={() => setSidebarOpen(true)} showMenuButton={isMobile} />

            {/* Main content */}
            <Box
               component="main"
               sx={{
                  p: 2,
                  flexGrow: 1,
                  boxSizing: "border-box",
               }}
            >
               {children}
            </Box>
         </Box>
      </Box>
   );
}
