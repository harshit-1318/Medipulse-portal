import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/apiClient';
import { createUser, getUsers, findById, updateUserById, deleteUser } from '../userService';
import { UserApi } from '../userTypes';

vi.mock('@/api/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), request: vi.fn() },
}));

describe('userService - CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createUser calls apiClient.post and propagates errors', async () => {
    const payload = { name: 'Test', email: 't@example.com', role: 'admin' };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ success: true, data: payload });
    expect(await createUser(payload)).toEqual({ success: true, data: payload });

    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'));
    await expect(createUser(payload)).rejects.toThrow('Network error');
  });

  it('getUsers constructs query url with defaults, search, site, and custom sort', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ users: [], total: 0 });

    await getUsers();
    expect(apiClient.get).toHaveBeenCalledWith('/users?page=1&limit=10&sortBy=createdAt&sort=desc');

    await getUsers(2, 20, 'john', 'site-1', 'name', 'asc');
    expect(apiClient.get).toHaveBeenCalledWith('/users?page=2&limit=20&sortBy=name&sort=asc&search=john&site=site-1');

    await getUsers(1, 10, '', 'all');
    expect(apiClient.get).toHaveBeenCalledWith('/users?page=1&limit=10&sortBy=createdAt&sort=desc&scope=all');
  });

  it('findById tries candidate URLs and handles 404 fallback', async () => {
    vi.mocked(apiClient.request).mockResolvedValueOnce({ data: { _id: 'u1' } });
    expect(await findById('u1')).toEqual({ data: { _id: 'u1' } });

    vi.mocked(apiClient.request)
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({ data: { _id: 'u1' } });
    expect(await findById('u1')).toEqual({ data: { _id: 'u1' } });
    expect(apiClient.request).toHaveBeenCalledTimes(3);
  });

  it('updateUserById sends PATCH request with payload', async () => {
    vi.mocked(apiClient.request).mockResolvedValueOnce({ data: { _id: 'u1', role: 'admin' } });
    const res = await updateUserById('u1', { role: 'admin' });
    expect(apiClient.request).toHaveBeenCalledWith({ url: '/users/u1', method: 'PATCH', data: { role: 'admin' } });
    expect(res).toEqual({ data: { _id: 'u1', role: 'admin' } });
  });

  it('deleteUser calls apiClient.delete with /users/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({ success: true });
    expect(await deleteUser('u1')).toEqual({ success: true });
    expect(apiClient.delete).toHaveBeenCalledWith('/users/u1');
  });
});
