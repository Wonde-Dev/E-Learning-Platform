import { api } from "@/lib/api";

export const reviewsApi = {
  forCourse: async (courseId) =>
    (await api.get(`/reviews/course/${courseId}`)).data.data,

  create: async (courseId, payload) =>
    (await api.post(`/reviews/course/${courseId}`, payload)).data.data,

  update: async (id, payload) =>
    (await api.patch(`/reviews/${id}`, payload)).data.data,

  remove: async (id) => (await api.delete(`/reviews/${id}`)).data.data,
};