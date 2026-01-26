"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import type { NavItem } from "./nav-config";
import { primaryNav, secondaryNav } from "./nav-config";
import { useIsMobile } from "../../hooks/useMobile";

const SIDEBAR_WIDTH = 300;

type DashboardSidebarProps = {
   open: boolean;
   onClose: () => void;
};

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
   const pathname = usePathname();

   return (
      <List disablePadding>
         {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
               <Box key={item.key}>
                  <ListItemButton
                     component={Link}
                     href={item.href}
                     onClick={onNavigate}
                     sx={{
                        ml: 0.5,
                        pl: 4,
                        borderRadius: 1.5,
                        py: 1,
                        bgcolor: active ? "#002F70" : "transparent",
                        color: active ? "#fff" : "#484848",
                        "&:hover": {
                           bgcolor: active ? "#002F70" : "action.hover",
                        },
                     }}
                  >
                     <ListItemIcon
                        sx={{
                           minWidth: 35,
                           color: active ? "primary.contrastText" : "text.secondary",
                        }}
                     >
                        {item.icon}
                     </ListItemIcon>
                     <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                           fontSize: 14,
                        }}
                     />
                  </ListItemButton>
               </Box>
            );
         })}
      </List>
   );
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
   const isMobile = useIsMobile();

   const content = (
      <Box
         sx={{
            pr: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
         }}
         role="navigation"
         aria-label="sidebar navigation"
      >
         {/* Top profile block */}
         <Box sx={{ pl: 4 }}>
            <Typography variant="subtitle1" color="#222222" noWrap sx={{ fontWeight: 600, mt: 5 }}>
               Profile
            </Typography>
            <Stack direction="row" alignItems="center" sx={{ mt: 2 }} spacing={1.25}>
               <Avatar sx={{ width: 40, height: 40 }}>G</Avatar>
               <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body1" color="#454545" sx={{ fontWeight: 500, fontSize: 13 }}>
                     Gwen Lam{" "}
                  </Typography>
                  <Typography variant="body1" color="#002F70" sx={{ fontSize: 10, fontWeight: 500 }}>
                     ST Comp Holdings Sdn Bhd
                  </Typography>
               </Box>
            </Stack>
         </Box>

         {/* Main nav */}
         <Box sx={{ pt: 1, mt: 4 }}>
            <Typography
               variant="caption"
               sx={{ px: 2, color: "text.secondary", fontWeight: 500, letterSpacing: 0.3, pl: 4 }}
            >
               Dashboard
            </Typography>
            <Box sx={{ mt: 1.5 }}>
               <NavList items={primaryNav} onNavigate={isMobile ? onClose : undefined} />
            </Box>
         </Box>

         {/* Bottom nav */}
         <Box sx={{ pb: 1, mt: 10 }}>
            <NavList items={secondaryNav} onNavigate={isMobile ? onClose : undefined} />
         </Box>
      </Box>
   );

   return (
      <Drawer
         open={open}
         onClose={onClose}
         variant={isMobile ? "temporary" : "permanent"}
         ModalProps={{ keepMounted: true }}
         sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
               width: SIDEBAR_WIDTH,
               boxSizing: "border-box",
               borderRight: "none",
            },
         }}
      >
         {content}
      </Drawer>
   );
}
