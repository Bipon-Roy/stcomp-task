"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
   Box,
   Button,
   Container,
   IconButton,
   InputAdornment,
   Paper,
   Stack,
   TextField,
   Typography,
   Alert,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { signInSchema, SignInValues } from "@/validators/auth.validator";
import { useEffect, useState } from "react";

export default function SignInPage() {
   const router = useRouter();

   const { signin, isLoading, isAuthenticated } = useAuthStore();

   const [showPassword, setShowPassword] = useState(false);
   const [formError, setFormError] = useState<string | null>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignInValues>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         email: "biponroy400@gmail.com",
         password: "A1234567@",
      },
      mode: "onSubmit",
   });

   const onSubmit = async (values: SignInValues) => {
      setFormError(null);

      try {
         await signin({ email: values.email, password: values.password });
      } catch {
         setFormError("Sign in failed. Please try again.");
      }
   };
   useEffect(() => {
      if (isAuthenticated) router.push("/dashboard/specialists");
   }, [router, isAuthenticated]);

   return (
      <Box
         sx={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            bgcolor: "#F9FAFB",
            py: 6,
         }}
      >
         <Container maxWidth="sm">
            <Paper
               elevation={0}
               variant="outlined"
               sx={{
                  borderColor: "#E5E7EB",
                  borderRadius: 3,
                  overflow: "hidden",
               }}
            >
               {/* Header */}
               <Box sx={{ p: 4 }}>
                  <Stack spacing={1.5} alignItems="center" textAlign="center">
                     <Box
                        sx={{
                           width: 48,
                           height: 48,
                           borderRadius: 2,
                           display: "grid",
                           placeItems: "center",
                           bgcolor: "#F3F4F6",
                           border: "1px solid #E5E7EB",
                        }}
                     >
                        <LockOutlinedIcon />
                     </Box>

                     <Typography variant="h5" fontWeight={600}>
                        Sign in to your account
                     </Typography>

                     <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        Welcome back — enter your details to continue.
                     </Typography>
                  </Stack>
               </Box>

               {/* Form */}
               <Box sx={{ p: 4 }}>
                  <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                     {formError ? <Alert severity="error">{formError}</Alert> : null}

                     <TextField
                        label="Email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        fullWidth
                        disabled={isLoading}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register("email")}
                        slotProps={{
                           input: {
                              startAdornment: (
                                 <InputAdornment position="start">
                                    <EmailOutlinedIcon fontSize="small" />
                                 </InputAdornment>
                              ),
                           },
                        }}
                     />

                     <TextField
                        label="Password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        fullWidth
                        disabled={isLoading}
                        type={showPassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register("password")}
                        slotProps={{
                           input: {
                              endAdornment: (
                                 <InputAdornment position="end">
                                    <IconButton
                                       aria-label={showPassword ? "Hide password" : "Show password"}
                                       onClick={() => setShowPassword((v) => !v)}
                                       edge="end"
                                       disabled={isLoading}
                                    >
                                       {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                    </IconButton>
                                 </InputAdornment>
                              ),
                           },
                        }}
                     />

                     <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography
                           variant="body2"
                           component={Link}
                           href="/forgot-password"
                           style={{ textDecoration: "none" }}
                           color="primary"
                        >
                           Forgot password?
                        </Typography>
                     </Stack>

                     <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disableElevation
                        disabled={isLoading}
                        sx={{ borderRadius: 2, py: 1.25, bgcolor: "#002F70", fontWeight: 500 }}
                     >
                        {isLoading ? "Signing in..." : "Sign in"}
                     </Button>

                     <Typography variant="body2" sx={{ color: "#6B7280", textAlign: "center" }}>
                        Don&apos;t have an account?{" "}
                        <Typography
                           component={Link}
                           href="/signup"
                           color="primary"
                           fontWeight={500}
                           variant="body2"
                           style={{ textDecoration: "none", color: "#002F70" }}
                        >
                           Create one
                        </Typography>
                     </Typography>
                  </Stack>
               </Box>
            </Paper>

            <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 2, textAlign: "center" }}>
               By continuing, you agree to our Terms & Privacy Policy.
            </Typography>
         </Container>
      </Box>
   );
}
