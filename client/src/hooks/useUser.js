import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "@/services/users.service";
import { qk } from "@/lib/queryKeys";

export function useUser() {
  return useQuery({
    queryKey: qk.me,
    queryFn: usersApi.me,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me });
      toast.success("Profile updated");
    },
    onError: (e) => toast.error(e.message || "Update failed"),
  });
}