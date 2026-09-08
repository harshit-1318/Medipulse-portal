import { useState } from 'react';
import { Eye, Pencil, Power } from 'lucide-react';
import type { User } from '@/components/users/types';
import toast from 'react-hot-toast';

interface UserRowActionsProps {
    user: User;
    onToggleUserActive: (userId: string, nextActive: boolean) => Promise<void>;
}

export function UserRowActions({ user, onToggleUserActive }: UserRowActionsProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleToggle = async () => {
        if (isProcessing) return;

        const nextActive = !(user.is_active ?? true);
        if (!nextActive) {
            const confirmed = window.confirm(
                [
                    'Disable this user?',
                    '',
                    `Name: ${user.name || '—'}`,
                    `Email: ${user.email || '—'}`,
                    `Role: ${user.is_super_admin ? 'Super Admin' : user.role || '—'}`,
                    `Site: ${user.siteName || '—'}`,
                ].join('\n'),
            );

            if (!confirmed) return;

            const verification = window.prompt(
                `Type the user email to confirm disable:\n${user.email}`,
                '',
            );

            if ((verification || '').trim().toLowerCase() !== (user.email || '').trim().toLowerCase()) {
                toast.error('Email verification failed. User was not disabled.');
                return;
            }
        }

        try {
            setIsProcessing(true);
            await onToggleUserActive(user._id, nextActive);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex items-center justify-center gap-1.5">
            <a
                href={`/users/${user._id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#00a294]/10 hover:text-[#00a294] hover:border-[#00a294]/30 active:scale-95 transition-all shadow-2xs"
            >
                <Eye size={13} strokeWidth={2} />
                <span>View</span>
            </a>

            <a
                href={`/users/${user._id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all shadow-2xs"
            >
                <Pencil size={13} strokeWidth={2} />
                <span>Edit</span>
            </a>

            <button
                type="button"
                onClick={handleToggle}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95 transition-all shadow-2xs disabled:cursor-not-allowed disabled:opacity-40"
                disabled={user.is_super_admin === true || isProcessing}
                title={user.is_super_admin ? 'Super Admin cannot be disabled from list actions' : undefined}
            >
                <Power size={13} strokeWidth={2} />
                <span>{user.is_active ?? true ? 'Disable' : 'Enable'}</span>
            </button>
        </div>
    );
}
