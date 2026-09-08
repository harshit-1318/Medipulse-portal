import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useGlobalLoader, useUserStore } from '@/store';
import { shouldHandleUnauthorizedRedirect } from '@/api/utils/unauthorized';
import { isLocalStorageDebugFlagEnabled } from '@/utils/env';

let isUnauthorizedRedirectInProgress = false;

const isVideoDebugEnabled = (): boolean => isLocalStorageDebugFlagEnabled('DEBUG_VIDEO_RECORDINGS');
const isVideoRequest = (url?: string): boolean => typeof url === 'string' && url.includes('/video/');

export function setupInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const reqId = Math.random().toString(36).substring(7);
      config._loaderId = reqId;
      useGlobalLoader.getState().start(reqId);

      const publicEndpoints = ['/sites/get-info-by-domain', '/auth/login', '/auth/signup'];
      const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

      if (!isPublicEndpoint) {
        const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
        if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;

        const lsSiteId = typeof window !== 'undefined' ? localStorage.getItem('X-SITE-ID') : null;
        const lsSiteKey = typeof window !== 'undefined' ? localStorage.getItem('X-SITE-KEY') : null;
        const lsSiteHost = typeof window !== 'undefined' ? localStorage.getItem('X-SITE-HOST') : null;

        if (lsSiteId && config.headers) config.headers['X-SITE-ID'] = lsSiteId;
        if (lsSiteKey && config.headers) config.headers['X-SITE-KEY'] = lsSiteKey;
        if (lsSiteHost && config.headers) config.headers['X-SITE-HOST'] = lsSiteHost;

        if (isVideoDebugEnabled() && isVideoRequest(config.url)) {
          console.log('[VIDEO_DEBUG][apiClient][request]', {
            method: config.method,
            url: config.url,
            hasToken: Boolean(token),
            siteId: lsSiteId,
            siteKey: lsSiteKey,
            siteHost: lsSiteHost,
          });
        }
      }
      return config;
    },
    (error: AxiosError) => {
      const reqId = error.config?._loaderId || 'unknown';
      useGlobalLoader.getState().stop(reqId);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const reqId = response.config?._loaderId || 'unknown';
      useGlobalLoader.getState().stop(reqId);
      const res = response.data;

      if (res && typeof res === 'object') {
        if ('status' in res) {
          if (res.status === 'SUCCESS' || res.status === 0 || res.status === '0') return res.data;
          return Promise.reject(new Error(res.message || 'API Error'));
        }
        if ('success' in res) {
          if (res.success === true) return res.data !== undefined ? res.data : res;
          return Promise.reject(new Error(res.message || 'API Error'));
        }
      }
      return res;
    },
    (error: AxiosError) => {
      const reqId = error.config?._loaderId || 'unknown';
      useGlobalLoader.getState().stop(reqId);

      if (error.response?.status === 401) {
        Cookies.remove('token', { path: '/' });
        if (typeof window !== 'undefined') localStorage.removeItem('accessToken');

        const shouldRedirect = shouldHandleUnauthorizedRedirect(error.config?.url);
        if (shouldRedirect && !isUnauthorizedRedirectInProgress) {
          isUnauthorizedRedirectInProgress = true;
          useUserStore.getState().actions.logout();
        }
      }
      return Promise.reject(error);
    }
  );
}
