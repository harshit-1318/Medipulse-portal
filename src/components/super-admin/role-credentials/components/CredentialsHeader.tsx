import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CredentialsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">Role Credentials</h1>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-semibold tracking-wide shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Controlled Password Vault</span>
      </div>
    </div>
  );
};

export default CredentialsHeader;
