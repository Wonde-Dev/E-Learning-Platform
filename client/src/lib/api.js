import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 20000,
});

/**
 * Attach Clerk session token to every request.
 * Usage in main.jsx:
 *   configureApiAuth(() => getToken());
 */
let tokenGetter = null;

export const configureApiAuth = (getter) => {
  tokenGetter = getter;
};

api.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore */
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message });
  }
);