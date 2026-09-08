import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setupInterceptors } from '../interceptors';
import { useGlobalLoader, useUserStore } from '@/store';

describe('API Interceptors (src/lib/api/interceptors.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Cookies.remove('token');
  });

  it('attaches loader and auth headers to requests for protected endpoints', async () => {
    const instance = axios.create();
    setupInterceptors(instance);

    Cookies.set('token', 'mock-token-xyz');
    localStorage.setItem('X-SITE-ID', 'site-123');

    const startSpy = vi.spyOn(useGlobalLoader.getState(), 'start');

    // Simulate request interceptor
    const requestHandler = (instance.interceptors.request as any).handlers[0].fulfilled;
    const config = await requestHandler({ url: '/orders', headers: {} });

    expect(config._loaderId).toBeDefined();
    expect(startSpy).toHaveBeenCalledWith(config._loaderId);
    expect(config.headers.Authorization).toBe('Bearer mock-token-xyz');
    expect(config.headers['X-SITE-ID']).toBe('site-123');
  });

  it('skips token and site headers for public endpoints', async () => {
    const instance = axios.create();
    setupInterceptors(instance);

    Cookies.set('token', 'mock-token-xyz');
    const requestHandler = (instance.interceptors.request as any).handlers[0].fulfilled;
    const config = await requestHandler({ url: '/auth/login', headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('unwraps data for successful response envelopes', async () => {
    const instance = axios.create();
    setupInterceptors(instance);

    const stopSpy = vi.spyOn(useGlobalLoader.getState(), 'stop');
    const responseHandler = (instance.interceptors.response as any).handlers[0].fulfilled;

    const res1 = await responseHandler({ data: { status: 'SUCCESS', data: { id: 10 } }, config: { _loaderId: '1' } });
    expect(res1).toEqual({ id: 10 });
    expect(stopSpy).toHaveBeenCalledWith('1');

    const res2 = await responseHandler({ data: { success: true, data: ['a', 'b'] }, config: { _loaderId: '2' } });
    expect(res2).toEqual(['a', 'b']);
  });

  it('rejects responses with error status or message', async () => {
    const instance = axios.create();
    setupInterceptors(instance);

    const responseHandler = (instance.interceptors.response as any).handlers[0].fulfilled;
    await expect(responseHandler({ data: { status: 'ERROR', message: 'Fail' }, config: {} })).rejects.toThrow('Fail');
    await expect(responseHandler({ data: { success: false, message: 'Invalid' }, config: {} })).rejects.toThrow('Invalid');
  });

  it('handles 401 error by clearing tokens and triggering logout', async () => {
    const instance = axios.create();
    setupInterceptors(instance);

    Cookies.set('token', 'active-token');
    localStorage.setItem('accessToken', 'active-token');

    const logoutSpy = vi.spyOn(useUserStore.getState().actions, 'logout');
    const errorHandler = (instance.interceptors.response as any).handlers[0].rejected;

    const error = { response: { status: 401 }, config: { url: '/orders', _loaderId: 'err-1' } };
    await expect(errorHandler(error)).rejects.toEqual(error);

    expect(Cookies.get('token')).toBeUndefined();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(logoutSpy).toHaveBeenCalled();
  });
});
