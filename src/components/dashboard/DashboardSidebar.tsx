"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import type { NavItem } from "./nav-config";
import { primaryNav, secondaryNav } from "./nav-config";
import { useIsMobile } from "../../hooks/useMobile";

const SIDEBAR_WIDTH = 260;

type DashboardSidebarProps = {
   open: boolean;
   onClose: () => void;
};

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
   const pathname = usePathname();

   return (
      <List disablePadding sx={{ px: 1 }}>
         {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
               <Box key={item.key} sx={{ mb: 0.5 }}>
                  <ListItemButton
                     component={Link}
                     href={item.href}
                     onClick={onNavigate}
                     sx={{
                        borderRadius: 1.5,
                        px: 1.25,
                        py: 1,
                        bgcolor: active ? "primary.main" : "transparent",
                        color: active ? "primary.contrastText" : "text.primary",
                        "&:hover": {
                           bgcolor: active ? "primary.main" : "action.hover",
                        },
                     }}
                  >
                     <ListItemIcon
                        sx={{
                           minWidth: 38,
                           color: active ? "primary.contrastText" : "text.secondary",
                        }}
                     >
                        {item.icon}
                     </ListItemIcon>
                     <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                           fontSize: 14,
                           fontWeight: active ? 600 : 500,
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
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
         }}
         role="navigation"
         aria-label="sidebar navigation"
      >
         {/* Top profile block */}
         <Stack direction="row" spacing={1.25} sx={{ px: 2, py: 2 }}>
            <Avatar sx={{ width: 40, height: 40 }}>G</Avatar>
            <Box sx={{ minWidth: 0 }}>
               <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                  Gwen Lam
               </Typography>
               <Typography variant="caption" color="text.secondary" noWrap>
                  ST Comp Holdings Sdn Bhd
               </Typography>
            </Box>
         </Stack>

         <Divider />

         {/* Main nav */}
         <Box sx={{ pt: 1 }}>
            <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: 700, letterSpacing: 0.3 }}>
               Dashboard
            </Typography>
            <Box sx={{ mt: 1 }}>
               <NavList items={primaryNav} onNavigate={isMobile ? onClose : undefined} />
            </Box>
         </Box>

         <Box sx={{ flex: 1 }} />

         {/* Bottom nav */}
         <Box sx={{ pb: 1 }}>
            <Divider sx={{ mb: 1 }} />
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
               borderRight: (t) => `1px solid ${t.palette.divider}`,
            },
         }}
      >
         {content}
      </Drawer>
   );
}
