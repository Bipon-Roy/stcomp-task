import { AxiosError } from "axios";

export const handleServiceLayerError = (error: unknown): never => {
   if (error && typeof error === "object" && "response" in error) {
      const apiError = error as AxiosError<{ message?: string }>;
      throw new Error(apiError.response?.data?.message || "An unexpected error occurred.");
   }
   throw new Error("An unexpected error occurred.");
};
