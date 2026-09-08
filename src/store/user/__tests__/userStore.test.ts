import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cookies from 'js-cookie';
import { useUserStore } from '../userStore';

describe('UserStore (src/store/user/userStore.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
    Cookies.remove('token');
    useUserStore.setState({ user: null, token: null });
  });

  it('sets user correctly and saves to localStorage', () => {
    const rawUser = {
      _id: 'user_456',
      email: 'admin@medipulse.io',
      role: 'ADMIN',
    };

    useUserStore.getState().actions.setUser(rawUser);

    const state = useUserStore.getState();
    expect(state.user?.id).toBe('user_456');
    expect(state.user?.email).toBe('admin@medipulse.io');
    expect(state.user?.effectiveRole).toBe('admin');
    expect(localStorage.getItem('user')).toContain('admin@medipulse.io');
  });

  it('clears user when null is provided to setUser', () => {
    useUserStore.getState().actions.setUser({ id: '1', email: 'test@a.com', role: 'user' });
    expect(useUserStore.getState().user).not.toBeNull();

    useUserStore.getState().actions.setUser(null);
    expect(useUserStore.getState().user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('sets and removes token with persistent storage sync', () => {
    useUserStore.getState().actions.setToken('jwt-sample-token');
    expect(useUserStore.getState().token).toBe('jwt-sample-token');
    expect(Cookies.get('token')).toBe('jwt-sample-token');
    expect(localStorage.getItem('accessToken')).toBe('jwt-sample-token');

    useUserStore.getState().actions.setToken('');
    expect(useUserStore.getState().token).toBe('');
    expect(Cookies.get('token')).toBeUndefined();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('performs logout and clears state and storage', () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    useUserStore.getState().actions.setUser({ id: '2', email: 'logout@test.com', role: 'driver' });
    useUserStore.getState().actions.setToken('token-to-clear');

    useUserStore.getState().actions.logout();

    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().token).toBeNull();
    expect(Cookies.get('token')).toBeUndefined();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
