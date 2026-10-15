import { api } from "@/lib/api";

const form = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return fd;
};

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const uploadsApi = {
  thumbnail: async (file) =>
    (await api.post("/uploads/thumbnail", form(file), multipart)).data.data,

  video: async (file) =>
    (await api.post("/uploads/video", form(file), multipart)).data.data,

  avatar: async (file) =>
    (await api.post("/uploads/avatar", form(file), multipart)).data.data,

  /** Upload a PDF or other document (returns { url, publicId, format, bytes }) */
  document: async (file) =>
    (await api.post("/uploads/document", form(file), multipart)).data.data,
};
