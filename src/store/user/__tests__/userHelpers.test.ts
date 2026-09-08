import { describe, it, expect, beforeEach } from 'vitest';
import Cookies from 'js-cookie';
import { isSuperAdminUser, getInitialUser, clearUserSessionStorage } from '../userHelpers';

describe('User Helpers (src/store/user/userHelpers.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('username');
    Cookies.remove('site_id');
  });

  describe('isSuperAdminUser', () => {
    it('returns true for super admin indicators', () => {
      expect(isSuperAdminUser({ is_super_admin: true })).toBe(true);
      expect(isSuperAdminUser({ role: 'super_admin' })).toBe(true);
      expect(isSuperAdminUser({ role: 'superadmin' })).toBe(true);
      expect(isSuperAdminUser({ effectiveRole: 'super_admin' })).toBe(true);
    });

    it('returns false for regular users or null input', () => {
      expect(isSuperAdminUser(null)).toBe(false);
      expect(isSuperAdminUser(undefined)).toBe(false);
      expect(isSuperAdminUser({ role: 'prescriber' })).toBe(false);
      expect(isSuperAdminUser({ role: 'admin' })).toBe(false);
    });
  });

  describe('getInitialUser', () => {
    it('reconstructs user info from localStorage if available', () => {
      const userPayload = {
        id: 'u_1',
        email: 'doctor@medipulse.io',
        role: 'prescriber',
      };
      localStorage.setItem('user', JSON.stringify(userPayload));

      const user = getInitialUser();
      expect(user?.id).toBe('u_1');
      expect(user?.email).toBe('doctor@medipulse.io');
      expect(user?.effectiveRole).toBe('prescriber');
      expect(user?.is_super_admin).toBe(false);
    });

    it('falls back to cookie credentials if localStorage is empty', () => {
      Cookies.set('role', 'pharmacist');
      Cookies.set('username', 'pharma_john');

      const user = getInitialUser();
      expect(user?.username).toBe('pharma_john');
      expect(user?.role).toBe('pharmacist');
      expect(user?.effectiveRole).toBe('pharmacist');
    });

    it('returns null if neither localStorage nor cookies exist', () => {
      expect(getInitialUser()).toBeNull();
    });
  });

  describe('clearUserSessionStorage', () => {
    it('purges all session keys from cookies and localStorage', () => {
      Cookies.set('token', 'active_token');
      localStorage.setItem('user', '{"id":"1"}');
      localStorage.setItem('accessToken', 'active_token');
      localStorage.setItem('dashboardFilters_site1', '{"status":"pending"}');

      clearUserSessionStorage();

      expect(Cookies.get('token')).toBeUndefined();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('dashboardFilters_site1')).toBeNull();
    });
  });
});
