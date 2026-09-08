import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/apiClient';
import {
  createUser,
  getUsers,
  findById,
  updateUserById,
  deleteUser,
  login,
  signup,
  logout,
} from '../userService';
import { UserApi } from '../userTypes';

vi.mock('@/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
  },
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('calls apiClient.post with UserApi.Users and data', async () => {
      const mockPayload = { name: 'Test User', email: 'test@example.com', role: 'prescriber' };
      const mockResponse = { success: true, data: { ...mockPayload, _id: '123' } };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await createUser(mockPayload);

      expect(apiClient.post).toHaveBeenCalledWith(UserApi.Users, mockPayload);
      expect(result).toEqual(mockResponse);
    });

    it('propagates error when apiClient.post rejects', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'));

      await expect(createUser({ email: 'err@example.com' })).rejects.toThrow('Network error');
    });
  });

  describe('getUsers', () => {
    it('constructs correct query url with defaults', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ users: [], total: 0 });

      await getUsers();

      expect(apiClient.get).toHaveBeenCalledWith('/users?page=1&limit=10&sortBy=createdAt&sort=desc');
    });

    it('constructs correct query url with search, site, and custom sort', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ users: [], total: 0 });

      await getUsers(2, 20, 'john', 'site-123', 'name', 'asc');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/users?page=2&limit=20&sortBy=name&sort=asc&search=john&site=site-123'
      );
    });

    it('handles site=all correctly', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ users: [], total: 0 });

      await getUsers(1, 10, '', 'all');

      expect(apiClient.get).toHaveBeenCalledWith('/users?page=1&limit=10&sortBy=createdAt&sort=desc&scope=all');
    });
  });

  describe('findById', () => {
    it('tries candidate URLs on success', async () => {
      vi.mocked(apiClient.request).mockResolvedValueOnce({ data: { _id: 'u1', name: 'User 1' } });

      const result = await findById('u1');

      expect(apiClient.request).toHaveBeenCalledWith({
        url: '/users/u1',
        method: 'GET',
        data: undefined,
      });
      expect(result).toEqual({ data: { _id: 'u1', name: 'User 1' } });
    });

    it('falls back to next candidate URL when 404 is returned', async () => {
      vi.mocked(apiClient.request)
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockResolvedValueOnce({ data: { _id: 'u1', name: 'User 1' } });

      const result = await findById('u1');

      expect(apiClient.request).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: { _id: 'u1', name: 'User 1' } });
    });
  });

  describe('updateUserById', () => {
    it('updates user via candidate request', async () => {
      vi.mocked(apiClient.request).mockResolvedValueOnce({ data: { _id: 'u1', role: 'admin' } });

      const result = await updateUserById('u1', { role: 'admin' });

      expect(apiClient.request).toHaveBeenCalledWith({
        url: '/users/u1',
        method: 'PATCH',
        data: { role: 'admin' },
      });
      expect(result).toEqual({ data: { _id: 'u1', role: 'admin' } });
    });
  });

  describe('deleteUser', () => {
    it('calls apiClient.delete with /users/:id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({ success: true });

      const result = await deleteUser('u1');

      expect(apiClient.delete).toHaveBeenCalledWith('/users/u1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('auth helpers', () => {
    it('login calls apiClient.post with /auth/login', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ success: true });
      await login({ email: 'test@example.com', password: '123' });
      expect(apiClient.post).toHaveBeenCalledWith(UserApi.Login, {
        email: 'test@example.com',
        password: '123',
      });
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
});
