import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/services/courses.service";
import { qk } from "@/lib/queryKeys";

export function useCourses(params = {}) {
  return useQuery({
    queryKey: qk.courses(params),
    queryFn: () => coursesApi.list(params),
  });
}

export function useCourse(slug) {
  return useQuery({
    queryKey: qk.course(slug),
    queryFn: () => coursesApi.detail(slug),
    enabled: !!slug,
  });
}

export function useMyCourses(params = {}) {
  return useQuery({
    queryKey: qk.myCourses(params),
    queryFn: () => coursesApi.mine(params),
  });
}