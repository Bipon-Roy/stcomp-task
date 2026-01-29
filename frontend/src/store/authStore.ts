import { create } from "zustand";
import { UserResponse } from "@/types";
import apiClient from "@/lib/axios";

interface AuthState {
   user: UserResponse | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   isCheckingAuth: boolean;
   remainingAttempts: number | null;

   signin: (data: UserResponse) => Promise<void>;
   logout: () => Promise<void>;
   currentUser: () => Promise<void>;
   setInitialUser: (user: UserResponse | null, isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
   user: null,
   isAuthenticated: false,
   isLoading: false,
   isCheckingAuth: true,
   remainingAttempts: null,

   // Signin function
   signin: async (data) => {
      set({ isLoading: true });
      try {
         const response = await apiClient.post("/users/signin", data);

         if (response.data) {
            set({ isAuthenticated: true });
            await get().currentUser();
         }
      } catch (error) {
         if (process.env.NODE_ENV === "development") {
            console.log(error);
         }
      } finally {
         set({ isLoading: false });
      }
   },

   // Logout function
   logout: async () => {
      set({ isLoading: true });
      try {
         const res = await apiClient.post("/users/logout");
         if (res.data) {
            set({ user: null, isAuthenticated: false });
         }
      } catch (error) {
         if (process.env.NODE_ENV === "development") {
            console.log(error);
         }
      } finally {
         set({ isLoading: false });
      }
   },

   // Get current user function
   currentUser: async () => {
      set({ isCheckingAuth: true });
      try {
         const response = await apiClient.get("/users/current-user");

         if (response.data) {
            set({ user: response.data.data, isAuthenticated: true });
         } else {
            set({ user: null, isAuthenticated: false });
         }
      } catch (error) {
         if (error) {
            set({ user: null, isAuthenticated: false });
         }
      } finally {
         set({ isCheckingAuth: false });
      }
   },

   setInitialUser: (user, isAuthenticated) => {
      set({ user, isAuthenticated, isCheckingAuth: false });
   },
}));
