import apiClient from "@/lib/axios";
import { handleServiceLayerError } from "@/utils/serviceLayerErrorHandler";

type Params = {
   page?: number;
   limit?: number;
   search?: string;
   params?: Record<string, unknown>;
};

export const handleGetRequest = async (url: string, params?: Record<string, unknown>) => {
   try {
      const { data } = await apiClient.get(url, {
         params,
      });

      return data.data;
   } catch (error: unknown) {
      handleServiceLayerError(error);
   }
};

export const handlePaginatedGetRequest = async <T>(
   url: string,
   { page = 1, limit = 10, search = "", params = {} }: Params = {}
): Promise<T> => {
   try {
      const { data } = await apiClient.get(url, {
         params: { ...params, page, limit, search },
      });

      return data.data;
   } catch (error: unknown) {
      handleServiceLayerError(error);
      throw error;
   }
};
