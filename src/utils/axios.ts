import axios, { AxiosRequestConfig } from 'axios';
// config
import { SERVER_BASE_URL } from '../config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: SERVER_BASE_URL });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  user: {
    login: 'api/user/login',
  },
};

export const getErrorResponse = (e: any): string => {
  if (!e) return 'Something went wrong';
  if (typeof e === 'string') return e;

  const data = e.response?.data ?? e.data;
  if (typeof data === 'string') return data;

  if (Array.isArray(data)) {
    return data.map((item) => (typeof item === 'string' ? item : item?.message || JSON.stringify(item))).join(', ');
  }

  if (data?.message) {
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  if (data?.error) {
    if (typeof data.error === 'string') return data.error;
    if (data.error.message) return data.error.message;
  }

  if (data?.errors) {
    if (Array.isArray(data.errors)) {
      return data.errors
        .map((err: any) =>
          err?.message || err?.field ? `${err.field ? `${err.field}: ` : ''}${err.message || err}` : String(err)
        )
        .join(', ');
    }
    if (typeof data.errors === 'object') {
      return Object.entries(data.errors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(', ');
    }
  }

  return e.message || 'Something went wrong';
};
