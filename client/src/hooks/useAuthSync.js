import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAuthSync() {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/users/me")).data.data,
    enabled: !!isSignedIn,
    staleTime: 1000 * 60 * 5,
  });
}