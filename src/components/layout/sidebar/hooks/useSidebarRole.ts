import Cookies from 'js-cookie';
import { useUserStore } from '@/store';

export function useSidebarRole(currentPath: string, initialPath: string, mounted: boolean) {
    const storeUser = useUserStore((state) => state.user);
    const cookieRole = typeof window !== 'undefined' ? Cookies.get('role') : '';
    const isSuperPath = (currentPath || initialPath || '').startsWith('/super-dashboard');

    const isSuper = Boolean(
        isSuperPath ||
        storeUser?.is_super_admin ||
        storeUser?.role === 'super_admin' ||
        storeUser?.effectiveRole === 'super_admin' ||
        cookieRole === 'super_admin' ||
        cookieRole === 'superadmin'
    );


    const resolvedRole = isSuper ? 'super_admin' : (storeUser?.effectiveRole || storeUser?.role || cookieRole || 'user');
    const effectiveRole = (mounted ? resolvedRole : (isSuperPath ? 'super_admin' : 'user')).toLowerCase();

    return effectiveRole;
}
