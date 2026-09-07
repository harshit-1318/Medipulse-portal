export function isParkedOrderTag(tags: any): boolean {
    if (!tags) return false;
    if (Array.isArray(tags)) {
        return tags.some((t: string) => t.toLowerCase().replace(/[\s-_]/g, '') === 'parkedorder');
    }
    if (typeof tags === 'string') {
        return tags.split(',').map((t: string) => t.trim().toLowerCase().replace(/[\s-_]/g, '')).includes('parkedorder');
    }
    return false;
}
