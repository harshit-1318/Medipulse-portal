import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { revealCredential } from '@/api/services/super-admin/role-credentials';
import { copyToClipboard } from '../utils';
import type { RoleCredentialUser } from '../types';

export function usePasswordReveal() {
  const [confirmModalUser, setConfirmModalUser] = useState<RoleCredentialUser | null>(null);
  const [revealedUserId, setRevealedUserId] = useState<string | null>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!revealedUserId) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [revealedUserId]);

  useEffect(() => {
    if (revealedUserId && secondsRemaining === 0) {
      setRevealedUserId(null);
      setRevealedPassword(null);
      toast('Password re-masked for security', { icon: '🔒' });
    }
  }, [revealedUserId, secondsRemaining]);

  const hidePassword = useCallback(() => {
    setRevealedUserId(null);
    setRevealedPassword(null);
    setSecondsRemaining(0);
  }, []);

  const requestReveal = useCallback((user: RoleCredentialUser) => {
    setConfirmModalUser(user);
  }, []);

  const cancelReveal = useCallback(() => {
    setConfirmModalUser(null);
  }, []);

  const confirmReveal = useCallback(async () => {
    if (!confirmModalUser) return;
    setLoading(true);
    try {
      const res = await revealCredential(confirmModalUser._id);
      setRevealedUserId(confirmModalUser._id);
      setRevealedPassword(res.revealedPassword);
      setSecondsRemaining(15);
      setConfirmModalUser(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reveal password');
    } finally {
      setLoading(false);
    }
  }, [confirmModalUser]);

  const copyPassword = useCallback((password: string) => {
    copyToClipboard(password, 'Password copied securely!');
  }, []);

  return {
    confirmModalUser,
    revealedUserId,
    revealedPassword,
    secondsRemaining,
    loading,
    requestReveal,
    cancelReveal,
    confirmReveal,
    hidePassword,
    copyPassword,
  };
}
