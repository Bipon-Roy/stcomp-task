"use client";

import { setRouter } from "@utils/routerInstance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface Props {
   children: ReactNode;
}

export function Providers({ children }: Props) {
   const router = useRouter();
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: 10 * 60 * 1000, // 30 minutes
                  gcTime: 30 * 60 * 1000, //cachetime
                  refetchOnWindowFocus: false,
                  refetchOnReconnect: false,
                  retry: 1,
               },
               mutations: {
                  retry: 0,
               },
            },
         })
   );

   useEffect(() => {
      setRouter(router);
   }, [router]);

   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
