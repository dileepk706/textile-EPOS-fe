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

    const url = originalRequest?.url || '';
    const status = error.response.status;

    // Check if this endpoint is an auth endpoint where 401 is NOT an expired session JWT
    const isAuthEndpoint =
      url.includes('/user-auth/') ||
      url.includes('/refresh-token/');

    // Check if this is a till action endpoint where 401 represents a till PIN/password error
    const isTillActionEndpoint =
      url.includes('/tills') &&
      (url.includes('/close') ||
        url.includes('/open') ||
        url.includes('/cash-in') ||
        url.includes('/cash-out') ||
        url.includes('/move-cash-in') ||
        url.includes('/move-cash-out') ||
        url.includes('/deposit') ||
        url.includes('/withdraw') ||
        url.includes('/take-cash') ||
        url.includes('/add-cash') ||
        url.includes('/block'));

    const responseMsg = String(
      error.response?.data?.message ||
      error.response?.data?.error ||
      ''
    ).toLowerCase();

    const isPinOrPasswordError =
      responseMsg.includes('pin') ||
      responseMsg.includes('password') ||
      responseMsg.includes('credential');

    // 1. Handle 401 Unauthorized for Token Refresh
    // ONLY attempt token refresh if this is NOT a login/register attempt AND NOT a till PIN/password action
    const shouldAttemptRefresh =
      status === 401 &&
      !originalRequest?._retry &&
      !isAuthEndpoint &&
      !isTillActionEndpoint &&
      !isPinOrPasswordError &&
      Boolean(useSessionStore.getState().accessToken);

    if (shouldAttemptRefresh) {
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

        // Never reload the page if user is already on /login
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.replace('/login');
        }

        console.warn('Session refresh failed:', refreshError);
        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Handle Validation Errors safely
    try {
      const validation = ApiErrorDataDtoSchema.safeParse(error.response?.data);

      if (validation.success) {
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
    } catch {
      // Continue and reject original error if parsing fails
    }

    return Promise.reject(error);
  }
);
