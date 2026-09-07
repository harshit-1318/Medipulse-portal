import axios, { type AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';

const defaultBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_API_BASE_URL || 'http://localhost:5000';
const baseURL = typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? '/api' : defaultBaseURL;

declare module 'axios' {
  export interface InternalAxiosRequestConfig<D = any> {
    _loaderId?: string;
  }
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

setupInterceptors(axiosInstance);

export class APIClient {
  get<T = unknown>(config: AxiosRequestConfig | string, extraConfig?: AxiosRequestConfig): Promise<T> {
    if (typeof config === 'string') return this.request<T>({ url: config, method: 'GET', ...extraConfig });
    return this.request<T>({ ...config, method: 'GET' });
  }
  post<T = unknown>(config: AxiosRequestConfig | string, data?: unknown): Promise<T> {
    if (typeof config === 'string') return this.request<T>({ url: config, method: 'POST', data });
    return this.request<T>({ ...config, method: 'POST' });
  }
  put<T = unknown>(config: AxiosRequestConfig | string, data?: unknown): Promise<T> {
    if (typeof config === 'string') return this.request<T>({ url: config, method: 'PUT', data });
    return this.request<T>({ ...config, method: 'PUT' });
  }
  patch<T = unknown>(config: AxiosRequestConfig | string, data?: unknown): Promise<T> {
    if (typeof config === 'string') return this.request<T>({ url: config, method: 'PATCH', data });
    return this.request<T>({ ...config, method: 'PATCH' });
  }
  delete<T = unknown>(config: AxiosRequestConfig | string, extraConfig?: AxiosRequestConfig): Promise<T> {
    if (typeof config === 'string') return this.request<T>({ url: config, method: 'DELETE', ...extraConfig });
    return this.request<T>({ ...config, method: 'DELETE' });
  }
  request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return axiosInstance.request<unknown, T>(config);
  }
}

export const apiClient = new APIClient();
export default apiClient;
