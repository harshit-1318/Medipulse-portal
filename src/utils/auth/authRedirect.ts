const POST_LOGIN_REDIRECT_KEY = 'AUTO_LOGOUT_POST_LOGIN_REDIRECT';

export const isValidPostLoginRedirectPath = (path: string | null | undefined): path is string => {
    if (!path || typeof path !== 'string') {
        return false;
    }

    if (!path.startsWith('/') || path.startsWith('//')) {
        return false;
    }

    const normalized = path.toLowerCase();
    if (normalized.startsWith('/login') || normalized.startsWith('/register')) {
        return false;
    }

    return true;
};

export const savePostLoginRedirectFromCurrentLocation = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const redirectPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (!isValidPostLoginRedirectPath(redirectPath)) {
        return;
    }

    window.sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirectPath);
};

export const consumePostLoginRedirect = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const redirectPath = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

    if (!isValidPostLoginRedirectPath(redirectPath)) {
        return null;
    }

    return redirectPath;
};
