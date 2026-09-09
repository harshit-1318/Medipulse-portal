import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/apiClient';
import {
  getRoleCredentials,
  revealCredential,
  resetCredentialPassword,
  toggleCredentialStatus,
} from '../roleCredentialsService';

vi.mock('@/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('roleCredentialsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches role credentials with normalized sort order and params', async () => {
    const mockData = {
      users: [{ _id: 'u1', name: 'Dr. Watson', email: 'doctor@medipulse.io', role: 'doctor' }],
      stats: { totalAccounts: 1, activeAccounts: 1, inactiveAccounts: 0, totalRoles: 1 },
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockData });

    const res = await getRoleCredentials({ search: 'Watson', role: 'doctor', sort: 'ascending' });

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/role-credentials', {
      params: {
        page: 1,
        limit: 10,
        search: 'Watson',
        role: 'doctor',
        status: undefined,
        sortBy: 'createdAt',
        sort: 'asc', // Normalized!
      },
    });
    expect(res.users).toHaveLength(1);
    expect(res.stats.totalAccounts).toBe(1);
  });

  it('reveals credential via POST with user ID', async () => {
    (apiClient.post as any).mockResolvedValueOnce({
      data: { userId: 'u1', email: 'doctor@medipulse.io', revealedPassword: 'Password123!' },
    });

    const res = await revealCredential('u1');
    expect(apiClient.post).toHaveBeenCalledWith('/super-admin/role-credentials/reveal', { userId: 'u1' });
    expect(res.revealedPassword).toBe('Password123!');
  });

  it('resets credential password', async () => {
    (apiClient.post as any).mockResolvedValueOnce({
      data: { userId: 'u1', email: 'doctor@medipulse.io', newPassword: 'NewPassword@2026' },
    });

    const res = await resetCredentialPassword('u1', 'NewPassword@2026');
    expect(apiClient.post).toHaveBeenCalledWith('/super-admin/role-credentials/reset-password', {
      userId: 'u1',
      newPassword: 'NewPassword@2026',
    });
    expect(res.newPassword).toBe('NewPassword@2026');
  });

  it('toggles credential active status', async () => {
    (apiClient.post as any).mockResolvedValueOnce({
      data: { userId: 'u1', is_active: false },
    });

    const res = await toggleCredentialStatus('u1', false);
    expect(apiClient.post).toHaveBeenCalledWith('/super-admin/role-credentials/toggle-status', {
      userId: 'u1',
      is_active: false,
    });
    expect(res.is_active).toBe(false);
  });
});
