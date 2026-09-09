import React from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import type { RoleCredentialUser } from '../types';

interface PasswordCellProps {
  user: RoleCredentialUser;
  isRevealed: boolean;
  revealedPassword: string | null;
  secondsRemaining: number;
  onRequestReveal: (user: RoleCredentialUser) => void;
  onHide: () => void;
  onCopy: (password: string) => void;
}

export const PasswordCell: React.FC<PasswordCellProps> = ({
  user,
  isRevealed,
  revealedPassword,
  secondsRemaining,
  onRequestReveal,
  onHide,
  onCopy,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!revealedPassword) return;
    onCopy(revealedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isRevealed && revealedPassword) {
    return (
      <div className="inline-flex items-center gap-2 bg-purple-50/70 border border-purple-200/80 px-2.5 py-1 rounded-lg">
        <span className="font-mono text-xs font-semibold text-purple-900 tracking-wider select-all">
          {revealedPassword}
        </span>

        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200/70 text-purple-800 tabular-nums">
          {secondsRemaining}s
        </span>

        <button
          type="button"
          onClick={handleCopy}
          title="Copy Password"
          className="p-1 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={onHide}
          title="Hide Password"
          className="p-1 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-mono text-sm tracking-widest text-slate-400 select-none">
        ••••••••••
      </span>
      <button
        type="button"
        onClick={() => onRequestReveal(user)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-md border border-slate-200/80 hover:border-purple-200 transition-all shadow-2xs"
      >
        <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
        <span>Show</span>
      </button>
    </div>
  );
};

export default PasswordCell;
