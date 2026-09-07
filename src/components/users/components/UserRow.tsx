import { m } from 'framer-motion';
import { AtSign } from 'lucide-react';
import type { User } from '@/components/users/types';
import { UserRowActions } from './UserRowActions';
import { formatCreatedDate, getAvatarStyles, getRoleStyles } from '../utils/userRowStyles';

interface UserRowProps {
    user: User;
    index: number;
    onToggleUserActive: (userId: string, nextActive: boolean) => Promise<void>;
}

export default function UserRow({ user, index, onToggleUserActive }: UserRowProps) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const avatarStyles = getAvatarStyles(user._id);

    return (
        <m.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"
        >
            <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-3.5">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-105 transition-transform shrink-0 ${avatarStyles}`}>
                        {initials}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <span className="font-semibold text-slate-900 text-sm tracking-tight truncate">
                            {user.name}
                        </span>
                        {!user.is_active && (
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                                Disabled
                            </span>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-3.5 align-middle">
                <div className="flex items-center gap-2 text-slate-600 font-medium text-xs sm:text-sm">
                    <div className="p-1 rounded-md bg-slate-100/80 text-slate-400 group-hover:text-[#00a294] transition-colors shrink-0">
                        <AtSign size={13} />
                    </div>
                    <span className="truncate">{user.email}</span>
                </div>
            </td>

            <td className="px-6 py-3.5 align-middle text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap shadow-xs ${getRoleStyles(user.role, user.is_super_admin)}`}>
                    {user.is_super_admin ? 'Super Admin' : user.role?.replace(/_/g, ' ')}
                </span>
            </td>

            <td className="px-6 py-3.5 align-middle text-xs font-medium text-slate-700">
                <span className="inline-block px-2.5 py-1 bg-slate-100/70 border border-slate-200/60 rounded-lg text-slate-700 whitespace-nowrap">
                    {user.siteName || 'All Sites'}
                </span>
            </td>

            <td className="px-6 py-3.5 align-middle text-xs font-medium text-slate-500 text-center whitespace-nowrap">
                {formatCreatedDate(user.createdAt)}
            </td>

            <td className="px-6 py-3.5 align-middle text-center">
                <UserRowActions user={user} onToggleUserActive={onToggleUserActive} />
            </td>
        </m.tr>
    );
}

