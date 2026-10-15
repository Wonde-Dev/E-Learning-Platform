import { api } from "@/lib/api";

export const coursesApi = {
  list: async (params = {}) =>
    (await api.get("/courses", { params })).data.data,

  detail: async (slug) => (await api.get(`/courses/${slug}`)).data.data,

  mine: async (params = {}) =>
    (await api.get("/courses/instructor/mine", { params })).data.data,

  create: async (payload) => (await api.post("/courses", payload)).data.data,

  update: async (id, payload) =>
    (await api.patch(`/courses/${id}`, payload)).data.data,

  remove: async (id) => (await api.delete(`/courses/${id}`)).data.data,
};