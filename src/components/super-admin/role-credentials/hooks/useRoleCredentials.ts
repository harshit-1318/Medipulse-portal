import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserInfo } from '@/store';
import { useDebounce } from '@/hooks';
import { getRoleCredentials } from '@/api/services/super-admin/role-credentials';
import type { RoleCredentialUser, RoleCredentialsStats, RoleCredentialsPagination } from '../types';

export function useRoleCredentials() {
  const userInfo = useUserInfo();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isSuperAdmin = mounted && (userInfo?.effectiveRole === 'super_admin' || userInfo?.is_super_admin === true);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 350);

  const [users, setUsers] = useState<RoleCredentialUser[]>([]);
  const [stats, setStats] = useState<RoleCredentialsStats>({
    totalAccounts: 0,
    activeAccounts: 0,
    inactiveAccounts: 0,
    totalRoles: 0,
  });
  const [pagination, setPagination] = useState<RoleCredentialsPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoleCredentials({
        search: debouncedSearch,
        role,
        status,
        sortBy,
        sort,
        page,
        limit,
      });
      setUsers(data.users || []);
      if (data.stats) setStats(data.stats);
      if (data.pagination) setPagination(data.pagination);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load credentials');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, role, status, sortBy, sort, page, limit]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSort('asc');
    }
    setPage(1);
  }, [sortBy]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setRole('all');
    setStatus('all');
    setPage(1);
  }, []);

  const activeFiltersCount = useMemo(() => {
    return (search.trim() ? 1 : 0) + (role !== 'all' ? 1 : 0) + (status !== 'all' ? 1 : 0);
  }, [search, role, status]);

  return {
    isSuperAdmin,
    users,
    stats,
    pagination,
    loading,
    error,
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    sortBy,
    sort,
    page,
    setPage,
    handleSort,
    clearFilters,
    activeFiltersCount,
    refresh: fetchCredentials,
  };
}
