import React from 'react';
import { AlertTriangle, KeyRound, X } from 'lucide-react';
import type { RoleCredentialUser } from '../types';

interface PasswordRevealConfirmModalProps {
  user: RoleCredentialUser | null;
  isOpen: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PasswordRevealConfirmModal: React.FC<PasswordRevealConfirmModalProps> = ({
  user,
  isOpen,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-amber-600">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Confirm Credential Reveal</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-700">
            Are you sure you want to reveal the password for <strong className="text-slate-900">{user.name}</strong> ({user.email})?
          </p>

          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
            <span className="font-semibold block">Security Advisory:</span>
            <span>Passwords are sensitive information. Avoid sharing credentials with unauthorized users. Credential access is audited.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-xs transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{loading ? 'Revealing...' : 'Reveal Password'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordRevealConfirmModal;
