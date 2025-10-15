import axios from 'axios';
import { useSessionStore } from '@/stores/sessionStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api'
});

api.interceptors.request.use(config => {
  const { accessToken } = useSessionStore.getState();
  if (accessToken) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const { refreshToken, setSession } = useSessionStore.getState();
    if (error.response?.status === 401 && refreshToken) {
      try {
        const refreshResponse = await axios.post(`${api.defaults.baseURL?.replace('/api', '')}/api/auth/refresh`, {
          refreshToken
        });
        setSession({
          accessToken: refreshResponse.data.accessToken,
          refreshToken: refreshResponse.data.refreshToken,
          user: refreshResponse.data.user
        });
        error.config.headers = {
          ...error.config.headers,
          Authorization: `Bearer ${refreshResponse.data.accessToken}`
        };
        return api.request(error.config);
      } catch (refreshError) {
        useSessionStore.getState().clearSession();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
