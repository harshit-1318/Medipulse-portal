import React from 'react';
import { ShieldCheck, KeyRound } from 'lucide-react';

export const CredentialsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200/80 shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role Credentials</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage and review login accounts assigned to different roles.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-semibold tracking-wide shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Controlled Password Vault</span>
      </div>
    </div>
  );
};

export default CredentialsHeader;
