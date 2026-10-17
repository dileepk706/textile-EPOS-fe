import axios, { AxiosError } from 'axios';
import { useSessionStore } from 'entities/session';
import { SERVER_BASE_URL } from 'config-global';
import { ApiErrorDataDtoSchema } from './api.contracts';
import { normalizeValidationErrors } from './api.lib';
import { useTextilesStore } from 'entities/textile/textile.store';

// ----------------------------------------------------------------------

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const getRefreshToken = async () => {
  const response = await axios.post(
    `${SERVER_BASE_URL}/refresh-token/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data.data.accessToken;
};

export const api = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useSessionStore.getState();
    const { setTextiles, clearTextile } = useTextilesStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      clearTextile();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    // 1. Handle 401 Unauthorized for Token Refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return await api(originalRequest);
        } catch (err) {
          return await Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use full URL and base axios to avoid interceptor loop
        const accessToken = await getRefreshToken();

        useSessionStore.getState().setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return await api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useSessionStore.getState().setSessionExpired(true);
        useSessionStore.getState().clearSession();
        window.location.href = '/login';
        console.log('refreshError', refreshError);
        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Handle Validation Errors (Existing Logic)
    const validation = ApiErrorDataDtoSchema.safeParse(error.response?.data);

    if (!validation.success) {
      return Promise.reject(error);
    }

    const normalizedErrorResponse = {
      ...error.response!,
      data: normalizeValidationErrors(validation.data),
    };

    return Promise.reject(
      new AxiosError(
        error.message,
        error.code,
        error.config,
        error.request,
        normalizedErrorResponse
      )
    );
  }
);
