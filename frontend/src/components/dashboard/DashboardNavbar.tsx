"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useIsMobile } from "@/hooks/useMobile";

type DashboardNavbarProps = {
   onOpenSidebar: () => void;
   showMenuButton?: boolean;
};

export function DashboardNavbar({ onOpenSidebar, showMenuButton = true }: DashboardNavbarProps) {
   const isMobile = useIsMobile();

   return (
      <AppBar
         position="sticky"
         elevation={1}
         sx={{
            bgcolor: "#fff",
            color: "text.primary",
            mt: { xs: 0, md: 3 },
            ml: isMobile ? 0 : "16px",
            width: isMobile ? "100%" : `calc(100% - 50px)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
         }}
      >
         <Toolbar sx={{ minHeight: 64, px: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               {showMenuButton && (
                  <IconButton onClick={onOpenSidebar} edge="start" aria-label="open sidebar">
                     <MenuIcon />
                  </IconButton>
               )}
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 6 }}>
               <Tooltip title="Messages">
                  <IconButton aria-label="messages" sx={{ p: 0 }}>
                     <MailOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
               </Tooltip>

               <Tooltip title="Notifications">
                  <IconButton aria-label="notifications" sx={{ p: 0 }}>
                     <Badge badgeContent={4} color="error">
                        <NotificationsNoneOutlinedIcon />
                     </Badge>
                  </IconButton>
               </Tooltip>

               <Tooltip title="Profile">
                  <IconButton aria-label="profile" sx={{ p: 0 }}>
                     <Avatar sx={{ width: 25, height: 25 }}>G</Avatar>
                  </IconButton>
               </Tooltip>
            </Box>
         </Toolbar>
      </AppBar>
   );
}
