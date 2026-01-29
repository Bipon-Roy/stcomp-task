import { useRouter } from "next/navigation";

type AppRouterInstance = ReturnType<typeof useRouter>;

let router: AppRouterInstance | null = null;

export const setRouter = (r: AppRouterInstance) => {
   router = r;
};

export const getRouter = () => router;
