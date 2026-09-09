import React from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import type { RoleCredentialsStats } from '../types';

interface CredentialsSummaryCardsProps {
  stats: RoleCredentialsStats;
  loading?: boolean;
}

export const CredentialsSummaryCards: React.FC<CredentialsSummaryCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Accounts',
      value: stats.totalAccounts,
      icon: Users,
      iconBg: 'bg-slate-100 text-slate-700',
      borderClass: 'border-slate-200',
    },
    {
      title: 'Active Accounts',
      value: stats.activeAccounts,
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderClass: 'border-emerald-200/80',
    },
    {
      title: 'Inactive Accounts',
      value: stats.inactiveAccounts,
      icon: UserX,
      iconBg: 'bg-rose-50 text-rose-600',
      borderClass: 'border-rose-200/80',
    },
    {
      title: 'Total Roles',
      value: stats.totalRoles,
      icon: Shield,
      iconBg: 'bg-purple-50 text-purple-600',
      borderClass: 'border-purple-200/80',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl p-3.5 sm:p-4 border ${card.borderClass} shadow-xs hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {loading ? (
                <div className="h-7 w-12 bg-slate-100 animate-pulse rounded" />
              ) : (
                card.value
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CredentialsSummaryCards;
