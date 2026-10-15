import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,           // 1 min
      gcTime: 1000 * 60 * 10,         // 10 min
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status && status < 500) return false; // don't retry 4xx
        return failureCount < 2;
      },
    },
    mutations: { retry: 0 },
  },
});