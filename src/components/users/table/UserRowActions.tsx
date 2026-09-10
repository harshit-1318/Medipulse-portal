import { useState } from 'react';
import { Eye, Pencil, Power } from 'lucide-react';
import type { User } from '@/components/users/types';
import toast from 'react-hot-toast';
import { ActionButton } from '@/components/common';

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
        <div className="flex items-center justify-center gap-2">
            <ActionButton
                icon={Eye}
                label="View"
                variant="cyan"
                href={`/users/${user._id}`}
                className="w-19.5 h-8"
            />

            <ActionButton
                icon={Pencil}
                label="Edit"
                variant="slate"
                href={`/users/${user._id}/edit`}
                className="w-19.5 h-8"
            />

            <button
                type="button"
                onClick={handleToggle}
                className="h-8 px-2.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50/50 hover:border-rose-300 text-[11px] font-bold font-montserrat tracking-wide flex items-center justify-center gap-1.5 hover:-translate-y-[1.5px] active:translate-y-0 transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(225,29,72,0.12)] disabled:opacity-40 disabled:cursor-not-allowed uppercase"
                disabled={user.is_super_admin === true || isProcessing}
                title={user.is_super_admin ? 'Super Admin cannot be disabled from list actions' : undefined}
            >
                <Power size={13} strokeWidth={2.5} className="text-rose-500" />
                <span>{user.is_active ?? true ? 'Disable' : 'Enable'}</span>
            </button>
        </div>
    );
}
