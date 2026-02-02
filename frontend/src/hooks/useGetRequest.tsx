import { handleGetRequest } from "@/services/handleGetRequest";
import { useQuery } from "@tanstack/react-query";
/**
 * useGetRequest - A reusable query hook for GET requests.
 *
 * @param {string} queryKey - Unique query key for caching and dependency tracking.
 * @param {string} url - Endpoint to fetch data from.
 * @param {Record<string, string>} [params] - Optional query parameters.
 * @param {boolean} [enabled=true] - Whether the query should auto-run on mount.
 *
 * Example:
 *
 */

export const useGetRequest = (
   queryKey: string | string[],
   url: string,
   params?: Record<string, unknown>,
   enabled?: boolean,
   options?: Record<string, unknown> // ✅ extra options
) => {
   return useQuery({
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey, params],
      queryFn: async () => await handleGetRequest(url, params),
      enabled,
      ...options, // ✅ merge dynamic React Query options
   });
};
