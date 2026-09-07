import { useState } from 'react';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store';
import { useGlobalLoader } from '@/store';
import { login } from '@/api/services/user/userService';
import { useSiteLoading } from '@/store';
import { consumePostLoginRedirect, isValidPostLoginRedirectPath } from '@/utils/auth';
import { isRouteAllowedForRole } from '@/proxyRoutes';

export function useLoginFormSubmit() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { setUser, setToken } = useUserStore((s) => s.actions);
    const { start: startLoader, stop: stopLoader } = useGlobalLoader();
    const isDetecting = useSiteLoading();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        startLoader('login');
        try {
            const response: any = await login({ email, password });
            const token = response.access_token || response.jwt || response.accessToken || response.token;

            if (response.user && token) {
                setUser(response.user);
                setToken(token);

                const emailToUse = email || response.user.email || 'user@medipulse.io';
                const userRole = response.user.effectiveRole || response.user.role || 'user';
                const isSuperAdmin = Boolean(response.user.is_super_admin) ||
                    userRole === 'super_admin' ||
                    userRole === 'superadmin';
                const finalRole = isSuperAdmin ? 'super_admin' : userRole;

                Cookies.set('role', finalRole, { expires: 7 });
                const username = emailToUse.split('@')[0].trim().toLowerCase();
                Cookies.set('username', username, { expires: 7 });

                let targetRedirect: string | null = null;
                if (typeof window !== 'undefined') {
                    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
                    if (returnUrl && isValidPostLoginRedirectPath(returnUrl) && isRouteAllowedForRole(returnUrl, finalRole)) {
                        targetRedirect = returnUrl;
                    }
                }
                const savedRedirect = consumePostLoginRedirect();
                if (!targetRedirect && savedRedirect && isRouteAllowedForRole(savedRedirect, finalRole)) {
                    targetRedirect = savedRedirect;
                }

                const defaultRedirect = isSuperAdmin ? '/super-dashboard' : '/dashboard';
                window.location.href = targetRedirect || defaultRedirect;
            } else {
                setError('Invalid credentials or response from server');
                stopLoader('login');
            }
        } catch (err: any) {
            if (err?.response?.status !== 401 && err?.response?.status !== 403) {
                console.error('Login error:', err);
            }
            let errorMessage = 'Login failed. Please check your credentials.';
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            stopLoader('login');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        isDetecting,
        handleSubmit,
    };
}
