const DEFAULT_FAVICON_URL = '/favicon.svg';

export const resolveFaviconUrl = (smallIconUrl?: string) => {
    const trimmed = (smallIconUrl || '').trim();
    return trimmed || DEFAULT_FAVICON_URL;
};

export const applySiteFavicon = (smallIconUrl?: string) => {
    if (typeof document === 'undefined') {
        return;
    }

    const href = resolveFaviconUrl(smallIconUrl);
    let iconLink = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');

    if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
    }

    iconLink.href = href;
};

export { DEFAULT_FAVICON_URL };
