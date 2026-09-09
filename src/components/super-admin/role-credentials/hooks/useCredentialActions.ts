import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { toggleCredentialStatus, resetCredentialPassword } from '@/api/services/super-admin/role-credentials';
import type { RoleCredentialUser } from '../types';

export function useCredentialActions(onRefresh: () => void) {
  const [drawerUser, setDrawerUser] = useState<RoleCredentialUser | null>(null);
  const [resetModalUser, setResetModalUser] = useState<RoleCredentialUser | null>(null);
  const [editModalUser, setEditModalUser] = useState<RoleCredentialUser | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const handleToggleStatus = useCallback(async (user: RoleCredentialUser) => {
    if (user.role === 'super_admin' && user.is_active) {
      toast.error('Super Admin account cannot be deactivated.');
      return;
    }
    setActionLoading(true);
    try {
      const nextActive = !user.is_active;
      await toggleCredentialStatus(user._id, nextActive);
      toast.success(`Account ${nextActive ? 'activated' : 'deactivated'} successfully`);
      if (drawerUser?._id === user._id) {
        setDrawerUser((prev) => prev ? { ...prev, is_active: nextActive } : null);
      }
      onRefresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update account status');
    } finally {
      setActionLoading(false);
    }
  }, [drawerUser, onRefresh]);

  const handleResetPassword = useCallback(async (userId: string, customPassword?: string) => {
    setActionLoading(true);
    try {
      const res = await resetCredentialPassword(userId, customPassword);
      toast.success('Password reset successfully!');
      onRefresh();
      return res.newPassword;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [onRefresh]);

  return {
    drawerUser,
    setDrawerUser,
    resetModalUser,
    setResetModalUser,
    editModalUser,
    setEditModalUser,
    actionLoading,
    handleToggleStatus,
    handleResetPassword,
  };
}
