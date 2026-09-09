import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, UserPen, KeyRound, Copy, UserX, UserCheck } from 'lucide-react';
import { copyToClipboard } from '../utils';
import { RoleBadge } from './RoleBadge';
import { PasswordCell } from './PasswordCell';
import type { RoleCredentialUser } from '../types';

interface CredentialsTableRowProps {
  user: RoleCredentialUser;
  isRevealed: boolean;
  revealedPassword: string | null;
  secondsRemaining: number;
  onRequestReveal: (user: RoleCredentialUser) => void;
  onHidePassword: () => void;
  onCopyPassword: (pw: string) => void;
  onViewDetails: (user: RoleCredentialUser) => void;
  onEdit: (user: RoleCredentialUser) => void;
  onResetPassword: (user: RoleCredentialUser) => void;
  onToggleStatus: (user: RoleCredentialUser) => void;
}

export const CredentialsTableRow: React.FC<CredentialsTableRowProps> = ({
  user,
  isRevealed,
  revealedPassword,
  secondsRemaining,
  onRequestReveal,
  onHidePassword,
  onCopyPassword,
  onViewDetails,
  onEdit,
  onResetPassword,
  onToggleStatus,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/75 transition-colors group">
      {/* User */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-indigo-100 text-purple-700 font-bold text-xs flex items-center justify-center border border-purple-200/60 shadow-2xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm leading-snug">{user.name}</div>
            <div className="text-[11px] text-slate-400">ID: {user._id.slice(-6)}</div>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <RoleBadge role={user.role} isSuper={user.is_super_admin} />
      </td>

      {/* Email */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5 font-medium text-slate-800 text-sm">
          <span>{user.email}</span>
          <button
            onClick={() => copyToClipboard(user.email, 'Email copied!')}
            title="Copy Email"
            className="p-1 text-slate-400 hover:text-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

      {/* Password */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <PasswordCell
          user={user}
          isRevealed={isRevealed}
          revealedPassword={revealedPassword}
          secondsRemaining={secondsRemaining}
          onRequestReveal={onRequestReveal}
          onHide={onHidePassword}
          onCopy={onCopyPassword}
        />
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => onViewDetails(user)}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-md border border-slate-200/80 transition-colors"
          >
            View Details
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-left text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100">
                <button onClick={() => { setMenuOpen(false); onViewDetails(user); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> View Details
                </button>
                <button onClick={() => { setMenuOpen(false); onEdit(user); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
                  <UserPen className="w-3.5 h-3.5 text-slate-400" /> Edit User
                </button>
                <button onClick={() => { setMenuOpen(false); onResetPassword(user); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
                  <KeyRound className="w-3.5 h-3.5 text-purple-600" /> Reset Password
                </button>
                <button onClick={() => { setMenuOpen(false); copyToClipboard(user.email, 'Email copied!'); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
                  <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Email
                </button>
                {revealedPassword && isRevealed && (
                  <button onClick={() => { setMenuOpen(false); onCopyPassword(revealedPassword); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50">
                    <Copy className="w-3.5 h-3.5 text-purple-600" /> Copy Password
                  </button>
                )}
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => { setMenuOpen(false); onToggleStatus(user); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 ${user.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                >
                  {user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  {user.is_active ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default CredentialsTableRow;
