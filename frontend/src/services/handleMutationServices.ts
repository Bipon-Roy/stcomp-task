import apiClient from "@/lib/axios";
import { AxiosError } from "axios";
import { FieldValues } from "react-hook-form";

const handleServiceLayerError = (error: unknown): never => {
   if (error && typeof error === "object" && "response" in error) {
      const apiError = error as AxiosError<{ message?: string }>;
      throw new Error(apiError.response?.data?.message || "An unexpected error occurred.");
   }
   throw new Error("An unexpected error occurred.");
};

//handle post request
export const handlePost = async (url: string, payload: FieldValues) => {
   try {
      const { data } = await apiClient.post(url, payload);
      return data;
   } catch (error: unknown) {
      handleServiceLayerError(error);
   }
};

//handle post request with formdata
export const handlePostFormData = async (url: string, formData: FormData) => {
   try {
      const { data } = await apiClient.post(url, formData);
      return data;
   } catch (error: unknown) {
      handleServiceLayerError(error);
   }
};

//handle update request request with formdata
export const handleUpdateFormData = async (url: string, payload: FieldValues, id?: string) => {
   try {
      const finalUrl = id ? `${url}/${id}` : url;
      const { data } = await apiClient.put(finalUrl, payload);
      return data;
   } catch (error: unknown) {
      handleServiceLayerError(error);
   }
};

//handle delete request with Id params
export const handleDelete = async (url: string) => {
   try {
      const { data } = await apiClient.delete(url);
      return data;
   } catch (error: unknown) {
      handleServiceLayerError(error);
   }
};
