import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { ROLE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../utils';

interface CredentialsFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  role: string;
  onRoleChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  activeCount: number;
  onClearAll: () => void;
}

export const CredentialsFilters: React.FC<CredentialsFiltersProps> = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  activeCount,
  onClearAll,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email or role..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[150px]">
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none cursor-pointer"
          >
            {ROLE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="min-w-[120px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-2 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
          >
            Clear Filters ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
};

export default CredentialsFilters;
