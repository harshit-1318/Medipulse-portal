import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/apiClient';
import { login, signup, logout } from '../userService';
import { UserApi } from '../userTypes';

vi.mock('@/api/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('userService - auth helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login calls apiClient.post with /auth/login', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ success: true });
    await login({ email: 'test@example.com', password: '123' });
    expect(apiClient.post).toHaveBeenCalledWith(UserApi.Login, { email: 'test@example.com', password: '123' });
  });

  it('signup calls apiClient.post with /auth/signup', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ success: true });
    await signup({ email: 'test@example.com' });
    expect(apiClient.post).toHaveBeenCalledWith(UserApi.SignUp, { email: 'test@example.com' });
  });

  it('logout calls apiClient.get with /auth/logout', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ success: true });
    await logout();
    expect(apiClient.get).toHaveBeenCalledWith(UserApi.Logout);
  });
});
