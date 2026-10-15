import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { enrollmentsApi } from "@/services/enrollments.service";
import { qk } from "@/lib/queryKeys";

export function useMyEnrollments() {
  return useQuery({
    queryKey: qk.myEnrollments,
    queryFn: enrollmentsApi.mine,
  });
}

export function useEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enrollmentsApi.enroll,
    onSuccess: () => {
      toast.success("Enrolled successfully!");
      qc.invalidateQueries({ queryKey: qk.myEnrollments });
    },
    onError: (e) => toast.error(e.message || "Enrollment failed"),
  });
}

export function useUpdateProgress(courseId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, completed }) =>
      enrollmentsApi.progress(courseId, lessonId, completed),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.enrollment(courseId) });
      qc.invalidateQueries({ queryKey: qk.myEnrollments });
    },
  });
}