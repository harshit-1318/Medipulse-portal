import React from 'react';
import { X, Copy, Shield, KeyRound, UserX, UserCheck } from 'lucide-react';
import { formatCredentialDate, copyToClipboard } from '../utils';
import { RoleBadge } from './RoleBadge';
import { PasswordCell } from './PasswordCell';
import type { RoleCredentialUser } from '../types';

interface UserDetailsDrawerProps {
  user: RoleCredentialUser | null;
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (user: RoleCredentialUser) => void;
  onToggleStatus: (user: RoleCredentialUser) => void;
  actionLoading?: boolean;
  isRevealed: boolean;
  revealedPassword: string | null;
  secondsRemaining: number;
  onRequestReveal: (user: RoleCredentialUser) => void;
  onHidePassword: () => void;
  onCopyPassword: (pw: string) => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onResetPassword,
  onToggleStatus,
  actionLoading,
  isRevealed,
  revealedPassword,
  secondsRemaining,
  onRequestReveal,
  onHidePassword,
  onCopyPassword,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">User Details</span>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Role</span>
              <RoleBadge role={user.role} isSuper={user.is_super_admin} />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Email</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-900">
                <span>{user.email}</span>
                <button
                  onClick={() => copyToClipboard(user.email, 'Email copied!')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Account Status</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 block">Created Date</span>
                <span className="font-medium text-slate-800">{formatCredentialDate(user.createdAt)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Last Login</span>
                <span className="font-medium text-slate-800">{formatCredentialDate(user.lastLogin)}</span>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wide">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Login Credentials</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Password</span>
                <PasswordCell
                  user={user}
                  isRevealed={isRevealed}
                  revealedPassword={revealedPassword}
                  secondsRemaining={secondsRemaining}
                  onRequestReveal={onRequestReveal}
                  onHide={onHidePassword}
                  onCopy={onCopyPassword}
                />
              </div>
              <p className="text-[11px] text-slate-500 italic pt-1 border-t border-purple-100/60">
                Passwords are sensitive information. Avoid sharing credentials with unauthorized users.
              </p>
            </div>

            {/* Assigned Permissions */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Assigned Permissions</span>
              <div className="flex flex-wrap gap-1.5">
                {user.permissions?.length ? user.permissions.map((perm, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                    {perm}
                  </span>
                )) : (
                  <span className="text-xs text-slate-400">Default role permissions</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              onClick={() => onResetPassword(user)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Reset Password
            </button>
            <button
              onClick={() => onToggleStatus(user)}
              disabled={actionLoading}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg transition-colors ${user.is_active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              {user.is_active ? 'Deactivate Account' : 'Activate Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsDrawer;
