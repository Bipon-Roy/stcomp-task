"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
   AppBar,
   Avatar,
   Box,
   Button,
   Container,
   Divider,
   Drawer,
   IconButton,
   InputBase,
   Menu,
   MenuItem,
   Stack,
   Toolbar,
   Tooltip,
   Typography,
   useMediaQuery,
   useTheme,
   ListItemIcon,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { UserResponse } from "@/types";
import { navLinks } from "./nav-links";
import { useAuthStore } from "@/store/authStore";
import { getCookie } from "@/utils/getCookie";

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
            pr: 1,
            pl: 0,
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
   const router = useRouter();
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const toggleDrawer = () => setMobileOpen((p) => !p);
   const { user, logout, isLoading, currentUser } = useAuthStore();

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const menuOpen = Boolean(anchorEl);

   const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
   const handleCloseMenu = () => setAnchorEl(null);

   const handleGoDashboard = () => {
      handleCloseMenu();
      router.push("/dashboard/specialists");
   };

   const handleLogout = async () => {
      handleCloseMenu();
      await logout();
      router.push("/");
   };

   React.useEffect(() => {
      const accessToken = getCookie("accessToken");
      if (accessToken) {
         currentUser();
      }
   }, [currentUser]);

   const drawer = (
      <Box sx={{ width: 320, p: 2 }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Image src="/logo.webp" alt="Anycomp" width={120} height={28} priority />
         </Box>

         <Divider sx={{ mb: 1.5 }} />

         <Stack spacing={0.5}>
            {navLinks.map((item) => (
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
            ))}
         </Stack>

         <Divider sx={{ my: 2 }} />

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
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
         }}
      >
         <Container maxWidth={false} sx={{ maxWidth: "1600px" }}>
            <Toolbar
               disableGutters
               sx={{
                  minHeight: 72,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
               }}
            >
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

               <Box sx={{ flex: 1 }} />

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

               <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Tooltip title="Messages">
                     <IconButton aria-label="messages" sx={{ color: "text.primary" }} size="small">
                        <MailOutlineIcon fontSize="small" />
                     </IconButton>
                  </Tooltip>

                  <Tooltip title="Notifications">
                     <IconButton aria-label="notifications" sx={{ color: "text.primary" }} size="small">
                        <NotificationsNoneIcon />
                     </IconButton>
                  </Tooltip>

                  {/* ✅ Auth area */}
                  {!user ? (
                     <Button
                        component={Link}
                        href="/signin"
                        variant="text"
                        disableElevation
                        sx={{
                           color: "#002F70",
                        }}
                     >
                        Sign in
                     </Button>
                  ) : (
                     <>
                        <Tooltip title="Account">
                           <IconButton aria-label="account" onClick={handleAvatarClick} sx={{ ml: 0.5 }} size="small">
                              <Avatar sx={{ width: 32, height: 32 }} alt={user?.name} src="/avatar.svg" />
                           </IconButton>
                        </Tooltip>

                        <Menu
                           anchorEl={anchorEl}
                           open={menuOpen}
                           onClose={handleCloseMenu}
                           onClick={handleCloseMenu}
                           transformOrigin={{ horizontal: "right", vertical: "top" }}
                           anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                           slotProps={{
                              paper: {
                                 sx: {
                                    mt: 1,
                                    borderRadius: 2,
                                    minWidth: 200,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    overflow: "hidden",
                                 },
                              },
                           }}
                        >
                           <Box sx={{ px: 2, py: 1.5 }}>
                              <Typography variant="subtitle2" fontWeight={500}>
                                 {user?.name}
                              </Typography>
                              {(user as UserResponse)?.email ? (
                                 <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    {(user as UserResponse).email}
                                 </Typography>
                              ) : null}
                           </Box>

                           <Divider />

                           <MenuItem onClick={handleGoDashboard}>
                              <ListItemIcon>
                                 <DashboardOutlinedIcon fontSize="small" />
                              </ListItemIcon>
                              Dashboard
                           </MenuItem>

                           <MenuItem onClick={handleLogout} disabled={isLoading}>
                              <ListItemIcon>
                                 <LogoutOutlinedIcon fontSize="small" />
                              </ListItemIcon>
                              Logout
                           </MenuItem>
                        </Menu>
                     </>
                  )}
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
