import { getRouter } from "@/utils/routerInstance";
import { showAlert } from "@/utils/showAlert";
import axios from "axios";

const apiClient = axios.create({
   baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
   withCredentials: true,
});

let refreshTokenPromise: Promise<void> | null = null;

const refreshAuthToken = async () => {
   try {
      await apiClient.post("/auth/refresh-session");
   } catch (error) {
      const router = getRouter();
      if (router) {
         router.replace("/");
      }
      showAlert("Your session has expired. Please sign in again.", "error");
      throw error;
   }
};

apiClient.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const message = error.response?.data?.message;

      const isAuthRoute = originalRequest.url?.includes("/auth/signin") || originalRequest.url?.includes("/logout");
      const isSessionExpired = status === 401 && message?.includes("Access token expired");

      if (isSessionExpired && !originalRequest._retry && !isAuthRoute) {
         originalRequest._retry = true;

         // If no refresh is in progress, start one
         if (!refreshTokenPromise) {
            refreshTokenPromise = refreshAuthToken().finally(() => {
               refreshTokenPromise = null; // Reset after refresh completes
            });
         }

         try {
            // Wait for the ongoing refresh to finish
            await refreshTokenPromise;
            return apiClient(originalRequest); // Retry original request
         } catch (refreshError) {
            return Promise.reject(refreshError);
         }
      }

      return Promise.reject(error);
   }
);

export default apiClient;
