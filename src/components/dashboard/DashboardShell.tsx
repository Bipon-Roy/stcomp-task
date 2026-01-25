"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { DashboardNavbar } from "./DashboardNavbar";

const SIDEBAR_WIDTH = 260;

export function DashboardShell({ children }: { children: React.ReactNode }) {
   const isMobile = useIsMobile();
   const [sidebarOpen, setSidebarOpen] = React.useState(false);

   const openSidebar = () => setSidebarOpen(true);
   const closeSidebar = () => setSidebarOpen(false);

   return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f7fa" }}>
         <DashboardNavbar onOpenSidebar={openSidebar} showMenuButton={isMobile} />

         <Box sx={{ display: "flex" }}>
            <DashboardSidebar open={isMobile ? sidebarOpen : true} onClose={closeSidebar} />

            <Box
               component="main"
               sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 2,
                  ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
               }}
            >
               {children}
            </Box>
         </Box>
      </Box>
   );
}
