"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
   AppBar,
   Avatar,
   Box,
   Button,
   Container,
   Divider,
   Drawer,
   IconButton,
   Stack,
   Toolbar,
   Tooltip,
   useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InputBase from "@mui/material/InputBase";
import { navLinks } from "./nav-links";

function NavLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
   return (
      <Button
         component={Link}
         href={href}
         variant="text"
         sx={{
            color: "text.primary",
            textTransform: "none",
            fontWeight: 500,
            px: 1,
            "&:hover": { bgcolor: "transparent", color: "#002F70" },
         }}
      >
         {children}
      </Button>
   );
}

export default function Navbar() {
   const theme = useTheme();
   const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
   const [mobileOpen, setMobileOpen] = React.useState(false);

   const toggleDrawer = () => setMobileOpen((p) => !p);

   const drawer = (
      <Box sx={{ width: 320, p: 2 }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Image src="/logo.webp" alt="Anycomp" width={120} height={28} priority />
         </Box>

         <Divider sx={{ mb: 1.5 }} />

         <Stack spacing={0.5}>
            {navLinks.map((item) => {
               return (
                  <Button
                     key={item.href}
                     component={Link}
                     href={item.href!}
                     onClick={() => setMobileOpen(false)}
                     sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        borderRadius: 1.5,
                        px: 1,
                     }}
                  >
                     {item.label}
                  </Button>
               );
            })}
         </Stack>

         <Divider sx={{ my: 2 }} />

         {/* Mobile search */}
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               border: "1px solid",
               borderColor: "divider",
               borderRadius: 1.5,
               px: 1,
               height: 40,
               mt: 2,
            }}
         >
            <InputBase placeholder="Search for any services" sx={{ flex: 1, fontSize: 14 }} />
            <IconButton size="small" aria-label="search">
               <SearchIcon fontSize="small" />
            </IconButton>
         </Box>
      </Box>
   );

   return (
      <AppBar
         position="sticky"
         elevation={1}
         sx={{
            bgcolor: "#fff",
            color: "text.primary",
            boxShadow: "0 2px 8px rgba(0,0,0.15,0.15)",
         }}
      >
         <Container maxWidth="xl">
            <Toolbar
               disableGutters
               sx={{
                  minHeight: 72,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
               }}
            >
               {/* Mobile hamburger */}
               {!isLgUp && (
                  <IconButton
                     onClick={toggleDrawer}
                     edge="start"
                     aria-label="open navigation"
                     sx={{ color: "text.primary" }}
                  >
                     <MenuIcon />
                  </IconButton>
               )}

               {/* Logo */}
               <Box
                  component={Link}
                  href="/"
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     textDecoration: "none",
                     mr: 1,
                  }}
               >
                  <Image src="/logo.webp" alt="Anycomp" width={180} height={30} priority />
               </Box>

               {/* Desktop links */}
               {isLgUp && (
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 1 }}>
                     {navLinks.map((item) => {
                        return (
                           <NavLinkButton key={item.href} href={item.href!}>
                              {item.label}
                           </NavLinkButton>
                        );
                     })}
                  </Stack>
               )}

               {/* Spacer */}
               <Box sx={{ flex: 1 }} />

               {/* Search (desktop/tablet) */}
               <Box
                  sx={{
                     display: { xs: "none", sm: "flex" },
                     alignItems: "center",
                     border: "1px solid",
                     borderColor: "divider",
                     borderRadius: 1.5,
                     pl: 1.25,
                     pr: 0.5,
                     height: 36,
                     width: { sm: 260, md: 340 },
                     maxWidth: 420,
                  }}
               >
                  <InputBase
                     placeholder="Search for any services"
                     sx={{ flex: 1, fontSize: 14 }}
                     inputProps={{ "aria-label": "search services" }}
                  />
                  <IconButton size="small" aria-label="search">
                     <SearchIcon fontSize="small" />
                  </IconButton>
               </Box>

               {/* Right icons */}
               <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 1 }}>
                  <Tooltip title="Messages">
                     <IconButton aria-label="messages" sx={{ color: "text.primary" }}>
                        <MailOutlineIcon />
                     </IconButton>
                  </Tooltip>

                  <Tooltip title="Notifications">
                     <IconButton aria-label="notifications" sx={{ color: "text.primary" }}>
                        <NotificationsNoneIcon />
                     </IconButton>
                  </Tooltip>

                  <Tooltip title="Account">
                     <IconButton aria-label="account">
                        <Avatar sx={{ width: 32, height: 32 }} alt="User" src="/avatar.svg" />
                     </IconButton>
                  </Tooltip>
               </Stack>
            </Toolbar>
         </Container>

         <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            slotProps={{ paper: { sx: { borderTopRightRadius: 16, borderBottomRightRadius: 16 } } }}
         >
            {drawer}
         </Drawer>
      </AppBar>
   );
}
