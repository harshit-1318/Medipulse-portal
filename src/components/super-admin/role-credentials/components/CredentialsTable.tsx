import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { CredentialsTableRow } from './CredentialsTableRow';
import type { RoleCredentialUser, RoleCredentialsPagination } from '../types';

interface CredentialsTableProps {
  users: RoleCredentialUser[];
  loading: boolean;
  pagination: RoleCredentialsPagination;
  sortBy: string;
  sort: 'asc' | 'desc';
  onSort: (col: string) => void;
  onPageChange: (page: number) => void;
  revealedUserId: string | null;
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

export const CredentialsTable: React.FC<CredentialsTableProps> = ({
  users,
  loading,
  pagination,
  sortBy,
  sort,
  onSort,
  onPageChange,
  revealedUserId,
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
  const renderSortIcon = (col: string) => {
    if (sortBy !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
    return sort === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-purple-600" /> : <ArrowDown className="w-3.5 h-3.5 text-purple-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 cursor-pointer select-none hover:text-slate-800" onClick={() => onSort('name')}>
                <div className="flex items-center gap-1.5"><span>User</span>{renderSortIcon('name')}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none hover:text-slate-800" onClick={() => onSort('role')}>
                <div className="flex items-center gap-1.5"><span>Role</span>{renderSortIcon('role')}</div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none hover:text-slate-800" onClick={() => onSort('email')}>
                <div className="flex items-center gap-1.5"><span>Email</span>{renderSortIcon('email')}</div>
              </th>
              <th className="py-3 px-4 select-none">Password</th>
              <th className="py-3 px-4 cursor-pointer select-none hover:text-slate-800" onClick={() => onSort('status')}>
                <div className="flex items-center gap-1.5"><span>Status</span>{renderSortIcon('status')}</div>
              </th>
              <th className="py-3 px-4 text-right select-none">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-4 w-28 bg-slate-100 rounded" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-36 bg-slate-100 rounded" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-100 rounded ml-auto" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No role accounts found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <CredentialsTableRow
                  key={user._id}
                  user={user}
                  isRevealed={revealedUserId === user._id}
                  revealedPassword={revealedUserId === user._id ? revealedPassword : null}
                  secondsRemaining={revealedUserId === user._id ? secondsRemaining : 0}
                  onRequestReveal={onRequestReveal}
                  onHidePassword={onHidePassword}
                  onCopyPassword={onCopyPassword}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onResetPassword={onResetPassword}
                  onToggleStatus={onToggleStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-200 text-xs text-slate-600">
        <div>
          Showing <span className="font-semibold text-slate-800">{users.length}</span> of <span className="font-semibold text-slate-800">{pagination.total}</span> accounts
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">Page {pagination.page} of {pagination.totalPages}</span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsTable;
