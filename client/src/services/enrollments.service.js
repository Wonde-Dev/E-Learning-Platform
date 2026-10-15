import { api } from "@/lib/api";

export const enrollmentsApi = {
  enroll: async (courseId) =>
    (await api.post("/enrollments", { courseId })).data.data,

  mine: async () => (await api.get("/enrollments/me")).data.data,

  getOne: async (courseId) =>
    (await api.get(`/enrollments/${courseId}`)).data.data,

  progress: async (courseId, lessonId, completed) =>
    (
      await api.patch(`/enrollments/${courseId}/progress`, {
        lessonId,
        completed,
      })
    ).data.data,
};