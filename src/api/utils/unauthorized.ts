const AUTH_PAGES = ['/login', '/register'];
const AUTH_ENDPOINTS = ['/auth/login', '/auth/signup'];

export function shouldHandleUnauthorizedRedirect(requestUrl?: string, currentPath?: string): boolean {
    const path = currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : '');
    const url = requestUrl ?? '';

    if (AUTH_PAGES.some((route) => path.startsWith(route))) {
        return false;
    }

    if (AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
        return false;
    }

    return true;
}
