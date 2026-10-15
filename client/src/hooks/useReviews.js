import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewsApi } from "@/services/reviews.service";
import { qk } from "@/lib/queryKeys";

export function useCourseReviews(courseId) {
  return useQuery({
    queryKey: qk.reviews(courseId),
    queryFn: () => reviewsApi.forCourse(courseId),
    enabled: !!courseId,
  });
}

export function useCreateReview(courseId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => reviewsApi.create(courseId, payload),
    onSuccess: () => {
      toast.success("Review posted!");
      qc.invalidateQueries({ queryKey: qk.reviews(courseId) });
      qc.invalidateQueries({ queryKey: qk.course });
    },
    onError: (e) => toast.error(e.message),
  });
}