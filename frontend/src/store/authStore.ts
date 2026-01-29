import { create } from "zustand";
import { ISigninData, UserResponse } from "@/types";
import apiClient from "@/lib/axios";

interface AuthState {
   user: UserResponse | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   isCheckingAuth: boolean;
   signin: (data: ISigninData) => Promise<void>;
   logout: () => Promise<void>;
   currentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
   user: null,
   isAuthenticated: false,
   isLoading: false,
   isCheckingAuth: true,

   // Signin function
   signin: async (data) => {
      set({ isLoading: true });
      try {
         const response = await apiClient.post("/auth/signin", data);

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
         const res = await apiClient.post("/auth/logout");
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
         const response = await apiClient.get("/auth/session");

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
}));
