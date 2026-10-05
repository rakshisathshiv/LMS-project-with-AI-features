import axios from 'axios';
import Cookies from 'js-cookie';

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return 'http://localhost:5000/api';
}

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const AUTH_NO_RETRY_PATHS = ['/auth/refresh', '/auth/login', '/auth/register'];

function isAuthNoRetryRequest(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_NO_RETRY_PATHS.some((path) => url.includes(path));
}

let refreshPromise: Promise<string> | null = null;

async function requestNewAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;
        Cookies.set('accessToken', newToken, { expires: 1 / 96 }); // 15 mins
        return newToken;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      originalRequest &&
      !originalRequest._retry &&
      !isAuthNoRetryRequest(originalRequest.url) &&
      status === 401
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await requestNewAccessToken();
        if (originalRequest.headers) {
          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
        }
        return api(originalRequest);
      } catch (err) {
        Cookies.remove('accessToken');
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          if (path !== '/login' && path !== '/signup') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
