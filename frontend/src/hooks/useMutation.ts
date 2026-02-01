import { handleDelete, handlePost, handlePostFormData, handleUpdateFormData } from "@/services/handleMutationServices";
import { showAlert } from "@/utils/showAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";

/**
 * usePost - A reusable mutation hook for making POST requests.
 *
 * @param {string} key - A unique mutation key for React Query's cache.
 * @param {string} url - The endpoint to which the POST request is made.
 *
 * @returns {UseMutationResult} - Returns mutation handlers (mutate, isLoading, etc.)
 *
;
 */

export const usePost = (key: string, url: string) => {
   return useMutation({
      mutationKey: [key],
      mutationFn: async (payload: FieldValues) => await handlePost(url, payload),
      onSuccess: (data) => {
         showAlert(data.message || "Successfully saved to database", "success");
      },
      onError: (error) => {
         showAlert(error.message || "Unable to fulfill the request", "error");
      },
   });
};

/**
 * usePostWithFormData - A reusable mutation hook for making POST requests with Formdata.
 *
 * @param {string} key - A unique mutation key for React Query's cache.
 * @param {string} url - The endpoint to which the POST request is made.
 *
 * @returns {UseMutationResult} - Returns mutation handlers (mutate, isLoading, etc.)
 *
;
 */

export const usePostWithFormData = (key: string, url: string) => {
   return useMutation({
      mutationKey: [key],
      mutationFn: async (payload: FormData) => await handlePostFormData(url, payload),
      onSuccess: (data) => {
         showAlert(data.message || "Successfully saved to database", "success");
      },

      onError: (error) => {
         showAlert(error.message || "Unable to fulfill the request", "error");
      },
   });
};

/**
 * useUpdateWithFormData - A reusable mutation hook for PUT updates with FromData.
 *
 * @param {string} key - Unique mutation key for caching and invalidation.
 * @param {string} url - Base endpoint for the update (e.g., "/admin/blogs").
 * @param {string} [id] - Optional ID to append to the URL for item-specific updates.
 *
 * Automatically appends ID to the URL if provided.
 *
 * Example:
 * const { mutate } = useUpdate("UPDATE_BLOG", "/admin/blogs", blogId);
 * mutate({ title: "Updated Title" });
 */
export const useUpdateWithFormData = (key: string, url: string) => {
   return useMutation({
      mutationKey: [key],
      mutationFn: async (formData: FormData) => {
         const id = formData.get("id")?.toString();
         formData.delete("id");
         return await handleUpdateFormData(url, formData, id);
      },

      onSuccess: (data) => {
         showAlert(data.message || "Update Successful", "success");
      },

      onError: (error) => {
         showAlert(error.message || "Unable to update", "error");
      },
   });
};

/**
 * useDeleteRequest - A reusable hook for DELETE operations.
 *
 * @param {string} key - Unique mutation key.
 * @param {string} url - The base URL to delete from.
 * @param {string} refetchQuery - Required for immediately refetching and Updating the UI.
 *
 * Example:
 * const { mutate } = useDeleteRequest("DELETE_USER", "/admin/users", userId);
 */
export const useDeleteRequest = (key: string, url: string, refetchQuery: string) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: [key],
      mutationFn: async (id: string) => {
         const fullUrl = `${url}/${id}`;
         return await handleDelete(fullUrl);
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: [refetchQuery] });

         showAlert(data.message || "Delete successfully completed", "success");
      },

      onError: (error) => {
         showAlert(error.message || "Unable to delete", "error");
      },
   });
};
