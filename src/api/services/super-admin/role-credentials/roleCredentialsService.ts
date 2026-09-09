import apiClient from '@/api/apiClient';
import { normalizeSortOrder } from '@/utils/url/urlBase';
import type {
  RoleCredentialsParams,
  RoleCredentialsResponse,
  RevealCredentialResponse,
  ResetPasswordResponse,
} from './types';

export async function getRoleCredentials(params: RoleCredentialsParams = {}): Promise<RoleCredentialsResponse> {
  const queryParams: Record<string, any> = {
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search?.trim() || undefined,
    role: params.role && params.role !== 'all' ? params.role : undefined,
    status: params.status && params.status !== 'all' ? params.status : undefined,
    sortBy: params.sortBy || 'createdAt',
    sort: normalizeSortOrder(params.sort),
  };

  const res: any = await apiClient.get('/super-admin/role-credentials', { params: queryParams });
  return (
    res?.data ||
    res || {
      users: [],
      stats: { totalAccounts: 0, activeAccounts: 0, inactiveAccounts: 0, totalRoles: 0 },
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    }
  );
}

export async function revealCredential(userId: string): Promise<RevealCredentialResponse> {
  const res: any = await apiClient.post('/super-admin/role-credentials/reveal', { userId });
  return res?.data || res;
}

export async function resetCredentialPassword(userId: string, newPassword?: string): Promise<ResetPasswordResponse> {
  const res: any = await apiClient.post('/super-admin/role-credentials/reset-password', { userId, newPassword });
  return res?.data || res;
}

export async function toggleCredentialStatus(userId: string, is_active: boolean): Promise<{ userId: string; is_active: boolean }> {
  const res: any = await apiClient.post('/super-admin/role-credentials/toggle-status', { userId, is_active });
  return res?.data || res;
}

export default {
  getRoleCredentials,
  revealCredential,
  resetCredentialPassword,
  toggleCredentialStatus,
};
