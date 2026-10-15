import { api } from "@/lib/api";

export const usersApi = {
  me: async () => (await api.get("/users/me")).data.data,
  updateMe: async (payload) => (await api.patch("/users/me", payload)).data.data,
  becomeInstructor: async (payload) =>
    (await api.post("/users/become-instructor", payload)).data.data,
  publicProfile: async (id) => (await api.get(`/users/${id}`)).data.data,
};