import React, { useState } from 'react';
import { KeyRound, X, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils';
import type { RoleCredentialUser } from '../types';

interface ResetPasswordModalProps {
  user: RoleCredentialUser | null;
  isOpen: boolean;
  onClose: () => void;
  onReset: (userId: string, customPassword?: string) => Promise<string>;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, isOpen, onClose, onReset }) => {
  const [customPassword, setCustomPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [newlyGenerated, setNewlyGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generated = await onReset(user._id, customPassword || undefined);
      setNewlyGenerated(generated);
    } catch {
      // Error handled by hook toast
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!newlyGenerated) return;
    copyToClipboard(newlyGenerated, 'New password copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-700">
            <KeyRound className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900">Reset User Password</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {newlyGenerated ? (
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-700">Password for <strong>{user.email}</strong> was reset to:</p>
            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="font-mono text-sm font-bold text-purple-950">{newlyGenerated}</span>
              <button onClick={handleCopy} className="p-1.5 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-lg">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={onClose} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-slate-600">Reset password for <strong>{user.name}</strong> ({user.email}). Leave blank to auto-generate a secure random password.</p>
            <input
              type="text"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              placeholder="Custom password (optional)"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg">
                {loading ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
