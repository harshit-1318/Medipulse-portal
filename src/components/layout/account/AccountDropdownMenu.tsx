import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccountDropdownMenuProps {
    displayAvatar: string;
    userNameSafe: string;
    userEmailSafe: string;
    handleLogout: () => void;
}

export const AccountDropdownMenu: React.FC<AccountDropdownMenuProps> = ({
    displayAvatar,
    userNameSafe,
    userEmailSafe,
    handleLogout,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden font-montserrat"
    >
        <div className="flex items-center gap-3 p-4 bg-slate-50/50 border-b border-slate-100">
            <img
                src={displayAvatar}
                alt="avatar"
                className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
            />
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 truncate" title={userNameSafe}>
                    {userNameSafe}
                </span>
                <span className="text-xs text-slate-500 font-medium truncate" title={userEmailSafe}>
                    {userEmailSafe}
                </span>
            </div>
        </div>

        <div className="p-1">
            <a
                href="/account"
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-brand-ocean hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
                <UserIcon size={16} />
                Account
            </a>

            <div className="h-px bg-slate-100 my-1 mx-2" />

            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <LogOut size={16} />
                Logout
            </button>
        </div>
    </motion.div>
);

export default AccountDropdownMenu;
