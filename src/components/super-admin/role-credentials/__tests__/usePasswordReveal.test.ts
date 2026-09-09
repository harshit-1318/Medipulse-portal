import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePasswordReveal } from '../hooks/usePasswordReveal';
import * as service from '@/api/services/super-admin/role-credentials';
import type { RoleCredentialUser } from '../types';

vi.mock('@/api/services/super-admin/role-credentials', () => ({
  revealCredential: vi.fn(),
}));

describe('usePasswordReveal Hook', () => {
  const mockUser: RoleCredentialUser = {
    _id: 'u999',
    name: 'Nurse Bennett',
    email: 'nurse@medipulse.io',
    role: 'nurse',
    is_active: true,
    is_super_admin: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: 'Never',
    hasPassword: true,
    permissions: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('manages request, confirm, countdown, and auto-mask lifecycle', async () => {
    (service.revealCredential as any).mockResolvedValueOnce({
      userId: 'u999',
      email: 'nurse@medipulse.io',
      revealedPassword: 'SecretPassword99!',
    });

    const { result } = renderHook(() => usePasswordReveal());

    expect(result.current.confirmModalUser).toBeNull();
    expect(result.current.revealedUserId).toBeNull();

    // 1. Request reveal
    act(() => {
      result.current.requestReveal(mockUser);
    });
    expect(result.current.confirmModalUser).toEqual(mockUser);

    // 2. Confirm reveal
    await act(async () => {
      await result.current.confirmReveal();
    });

    expect(result.current.confirmModalUser).toBeNull();
    expect(result.current.revealedUserId).toBe('u999');
    expect(result.current.revealedPassword).toBe('SecretPassword99!');
    expect(result.current.secondsRemaining).toBe(15);

    // 3. Fast forward timer by 5s
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.secondsRemaining).toBe(10);

    // 4. Fast forward timer until expiration (> 10s)
    act(() => {
      vi.advanceTimersByTime(11000);
    });
    expect(result.current.revealedUserId).toBeNull();
    expect(result.current.revealedPassword).toBeNull();
  });

  it('allows cancelling reveal confirmation', () => {
    const { result } = renderHook(() => usePasswordReveal());
    act(() => {
      result.current.requestReveal(mockUser);
    });
    expect(result.current.confirmModalUser).toEqual(mockUser);

    act(() => {
      result.current.cancelReveal();
    });
    expect(result.current.confirmModalUser).toBeNull();
  });
});
