import React from 'react';
import { Eye, UserPen, KeyRound, Copy, UserX, UserCheck } from 'lucide-react';
import { copyToClipboard } from '../utils';
import type { RoleCredentialUser } from '../types';

interface CredentialsRowMenuProps {
  user: RoleCredentialUser;
  revealedPassword: string | null;
  isRevealed: boolean;
  onClose: () => void;
  onViewDetails: (user: RoleCredentialUser) => void;
  onEdit: (user: RoleCredentialUser) => void;
  onResetPassword: (user: RoleCredentialUser) => void;
  onCopyPassword: (pw: string) => void;
  onToggleStatus: (user: RoleCredentialUser) => void;
}

export const CredentialsRowMenu: React.FC<CredentialsRowMenuProps> = ({
  user,
  revealedPassword,
  isRevealed,
  onClose,
  onViewDetails,
  onEdit,
  onResetPassword,
  onCopyPassword,
  onToggleStatus,
}) => {
  return (
    <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-left text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100">
      <button onClick={() => { onClose(); onViewDetails(user); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
        <Eye className="w-3.5 h-3.5 text-slate-400" /> View Details
      </button>
      <button onClick={() => { onClose(); onEdit(user); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
        <UserPen className="w-3.5 h-3.5 text-slate-400" /> Edit User
      </button>
      <button onClick={() => { onClose(); onResetPassword(user); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
        <KeyRound className="w-3.5 h-3.5 text-indigo-600" /> Reset Password
      </button>
      <button onClick={() => { onClose(); copyToClipboard(user.email, 'Email copied!'); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
        <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Email
      </button>
      {revealedPassword && isRevealed && (
        <button onClick={() => { onClose(); onCopyPassword(revealedPassword); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
          <Copy className="w-3.5 h-3.5 text-indigo-600" /> Copy Password
        </button>
      )}
      <div className="my-1 border-t border-slate-100" />
      <button
        onClick={() => { onClose(); onToggleStatus(user); }}
        className={`w-full flex items-center gap-2 px-3 py-2 ${user.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
      >
        {user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
        {user.is_active ? 'Deactivate Account' : 'Activate Account'}
      </button>
    </div>
  );
};
