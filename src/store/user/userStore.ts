import { create } from 'zustand';
import Cookies from 'js-cookie';
import { isSuperAdminUser, getInitialUser, clearUserSessionStorage } from './userHelpers';

export interface UserInfo {
    id?: string;
    email: string;
    username?: string;
    role: string;
    is_super_admin: boolean;
    effectiveRole: string;
}

interface UserState {
    user: UserInfo | null;
    token: string | null;
    actions: {
        setUser: (user: any) => void;
        setToken: (token: string) => void;
        logout: () => void;
    };
}

export const useUserStore = create<UserState>((set) => ({
    user: getInitialUser(),
    token: typeof window !== 'undefined' ? Cookies.get('token') || null : null,

    actions: {
        setUser: (rawUser) => {
            if (!rawUser) {
                localStorage.removeItem('user');
                set({ user: null });
                return;
            }

            const isSuper = isSuperAdminUser(rawUser);
            const effectiveRole = isSuper ? 'super_admin' : (rawUser.effectiveRole || rawUser.role || 'user');

            const userInfo: UserInfo = {
                id: rawUser._id || rawUser.id,
                email: rawUser.email,
                username: rawUser.username || rawUser.email?.split('@')[0],
                role: isSuper ? 'super_admin' : (rawUser.role || 'user'),
                is_super_admin: isSuper,
                effectiveRole: effectiveRole.toLowerCase(),
            };

            localStorage.setItem('user', JSON.stringify(userInfo));
            set({ user: userInfo });
        },

        setToken: (token) => {
            if (token) {
                Cookies.set('token', token, { expires: 7, path: '/' });
                localStorage.setItem('accessToken', token);
            } else {
                Cookies.remove('token', { path: '/' });
                localStorage.removeItem('accessToken');
            }
            set({ token });
        },

        logout: () => {
            try {
                if (typeof window !== 'undefined') {
                    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
                }
            } catch {}
            clearUserSessionStorage();
            set({ user: null, token: null });
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        },

    },
}));

// Selectors
export const useUserInfo = () => useUserStore((s) => s.user);
export const useUserToken = () => useUserStore((s) => s.token);
export const useUserActions = () => useUserStore((s) => s.actions);
