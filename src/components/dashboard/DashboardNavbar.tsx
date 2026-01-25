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

type DashboardNavbarProps = {
   onOpenSidebar: () => void;
   showMenuButton?: boolean;
};

export function DashboardNavbar({ onOpenSidebar, showMenuButton = true }: DashboardNavbarProps) {
   return (
      <AppBar
         position="sticky"
         elevation={0}
         sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Tooltip title="Messages">
                  <IconButton aria-label="messages">
                     <Badge variant="dot" color="error">
                        <MailOutlineOutlinedIcon />
                     </Badge>
                  </IconButton>
               </Tooltip>

               <Tooltip title="Notifications">
                  <IconButton aria-label="notifications">
                     <Badge badgeContent={2} color="error">
                        <NotificationsNoneOutlinedIcon />
                     </Badge>
                  </IconButton>
               </Tooltip>

               <Tooltip title="Profile">
                  <IconButton aria-label="profile">
                     <Avatar sx={{ width: 32, height: 32 }}>G</Avatar>
                  </IconButton>
               </Tooltip>
            </Box>
         </Toolbar>
      </AppBar>
   );
}
