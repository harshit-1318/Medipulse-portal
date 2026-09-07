import Cookies from 'js-cookie';
import type { UserInfo } from './userStore';

export function isSuperAdminUser(user: any): boolean {
    if (!user) return false;
    return Boolean(
        user.is_super_admin ||
        user.role === 'super_admin' ||
        user.role === 'superadmin' ||
        user.effectiveRole === 'super_admin'
    );
}


export function getInitialUser(): UserInfo | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem('user');
        if (raw) {
            const parsed = JSON.parse(raw);
            const isSuper = isSuperAdminUser(parsed);
            const resolvedRole = (parsed.effectiveRole || (isSuper ? 'super_admin' : parsed.role) || 'user').toLowerCase();
            return {
                id: parsed.id || parsed._id,
                email: parsed.email || '',
                username: parsed.username || parsed.email?.split('@')[0] || 'User',
                role: isSuper ? 'super_admin' : (parsed.role || 'user'),
                is_super_admin: isSuper,
                effectiveRole: isSuper ? 'super_admin' : resolvedRole,
            };
        }
        const cookieRole = Cookies.get('role');
        const cookieUsername = Cookies.get('username');
        if (cookieRole) {
            const isSuper = cookieRole === 'super_admin' || cookieRole === 'superadmin';
            return {
                email: cookieUsername ? `${cookieUsername}@medipulse.io` : 'user@medipulse.io',
                username: cookieUsername || 'User',
                role: cookieRole,
                is_super_admin: isSuper,
                effectiveRole: (isSuper ? 'super_admin' : cookieRole).toLowerCase(),
            };
        }
    } catch {
        return null;
    }
    return null;
}

export function clearUserSessionStorage() {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    Cookies.remove('username', { path: '/' });
    Cookies.remove('site_id', { path: '/' });
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('global-search-recent');
    localStorage.removeItem('customer-filters');
    Object.keys(localStorage)
        .filter((key) => key.startsWith('dashboardFilters_'))
        .forEach((key) => localStorage.removeItem(key));
}
