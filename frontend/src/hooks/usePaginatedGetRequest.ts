import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const usePaginatedRequest = <T>(
   queryKey: string,
   url: string,
   {
      page = 1,
      limit = 10,
      search = "",
      enabled = true,
      params = {},
   }: {
      params?: Record<string, unknown>;
      page?: number;
      limit?: number;
      search?: string;
      enabled?: boolean;
   }
) => {
   return useQuery<T, Error>({
      queryKey: [queryKey, { page, limit, search, ...params }],
      queryFn: async () => {
         try {
            const { data } = await apiClient.get(url, {
               params: { ...params, page, limit, search },
            });
            return data.data;
         } catch (error) {
            if (error && typeof error === "object" && "response" in error) {
               const apiError = error as AxiosError<{ message?: string }>;
               throw new Error(apiError.response?.data?.message || "Unexpected error");
            }
            throw new Error("Unexpected error");
         }
      },
      staleTime: 5 * 60 * 1000,
      enabled,
      placeholderData: (previousData) => previousData,
   });
};
