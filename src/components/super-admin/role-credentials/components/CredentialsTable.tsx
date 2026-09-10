import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { CredentialsTableRow } from './CredentialsTableRow';
import type { RoleCredentialUser, RoleCredentialsPagination } from '../types';
import { Pagination } from '@/components/common/Pagination';

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
    if (sortBy !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400" />;
    return sort === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-montserrat flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="inline-flex flex-col">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
              Role Credentials List
            </h2>
            <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
              {pagination.total}
            </span>
          </div>
          <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full shadow-xs" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-slate-200 font-montserrat sticky top-0 z-10 text-[14px] font-extrabold tracking-widest text-[#003B73]/80 uppercase">
              <th className="py-4 px-5 cursor-pointer select-none hover:text-indigo-600 group" onClick={() => onSort('name')}>
                <div className="flex items-center gap-1.5"><span>User</span>{renderSortIcon('name')}</div>
              </th>
              <th className="py-4 px-5 cursor-pointer select-none hover:text-indigo-600 group" onClick={() => onSort('role')}>
                <div className="flex items-center gap-1.5"><span>Role</span>{renderSortIcon('role')}</div>
              </th>
              <th className="py-4 px-5 cursor-pointer select-none hover:text-indigo-600 group" onClick={() => onSort('email')}>
                <div className="flex items-center gap-1.5"><span>Email</span>{renderSortIcon('email')}</div>
              </th>
              <th className="py-4 px-5 select-none">Password</th>
              <th className="py-4 px-5 cursor-pointer select-none hover:text-indigo-600 group" onClick={() => onSort('status')}>
                <div className="flex items-center gap-1.5"><span>Status</span>{renderSortIcon('status')}</div>
              </th>
              <th className="py-4 px-5 text-right select-none">Actions</th>
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

      <div className="px-5 py-3 bg-white border-t border-slate-200">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default CredentialsTable;
