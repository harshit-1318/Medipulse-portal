import { describe, expect, it } from 'vitest';
import { applySiteFavicon, DEFAULT_FAVICON_URL, resolveFaviconUrl } from './favicon';

describe('favicon utils', () => {
    it('resolveFaviconUrl returns custom URL when provided', () => {
        expect(resolveFaviconUrl('https://cdn.example.com/icons/site-icon.png')).toBe('https://cdn.example.com/icons/site-icon.png');
    });

    it('resolveFaviconUrl falls back to default for empty values', () => {
        expect(resolveFaviconUrl('')).toBe(DEFAULT_FAVICON_URL);
        expect(resolveFaviconUrl('   ')).toBe(DEFAULT_FAVICON_URL);
        expect(resolveFaviconUrl(undefined)).toBe(DEFAULT_FAVICON_URL);
    });

    it('applySiteFavicon updates existing icon link', () => {
        document.head.innerHTML = '<link rel="icon" href="/favicon.svg">';

        applySiteFavicon('https://cdn.example.com/icons/new-icon.ico');

        const iconLink = document.querySelector('link[rel~="icon"]') as HTMLLinkElement;
        expect(iconLink).toBeTruthy();
        expect(iconLink.getAttribute('href')).toBe('https://cdn.example.com/icons/new-icon.ico');
    });

    it('applySiteFavicon creates icon link when missing', () => {
        document.head.innerHTML = '';

        applySiteFavicon('');

        const iconLink = document.querySelector('link[rel~="icon"]') as HTMLLinkElement;
        expect(iconLink).toBeTruthy();
        expect(iconLink.getAttribute('href')).toBe(DEFAULT_FAVICON_URL);
    });
});
