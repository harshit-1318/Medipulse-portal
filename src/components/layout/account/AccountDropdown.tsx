import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store';
import { getGravatarUrl } from '@/utils/helpers';
import { AccountDropdownMenu } from './AccountDropdownMenu';

export default function AccountDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, actions } = useUserStore();
    const [storeUser, setStoreUser] = useState<{ username?: string, email?: string }>({ username: 'User', email: '' });

    useEffect(() => {
        if (user) {
            setStoreUser({ username: user.username, email: user.email });
        }
    }, [user]);

    const userNameSafe = storeUser.username || 'Admin';
    const userEmailSafe = storeUser.email || '';
    const displayAvatar = getGravatarUrl(userEmailSafe, 80);

    const handleLogout = () => {
        actions.logout();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm focus:outline-none hover:ring-2 hover:ring-brand-cyan/50 transition-all"
                aria-label="User menu"
            >
                <img
                    src={displayAvatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <AccountDropdownMenu
                            displayAvatar={displayAvatar}
                            userNameSafe={userNameSafe}
                            userEmailSafe={userEmailSafe}
                            handleLogout={handleLogout}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
