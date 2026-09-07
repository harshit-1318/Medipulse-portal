/**
 * Convert text to URL-safe slug
 * @example
 * slugify('MediPulse UK') // 'medipulse-uk'
 * slugify('Hello World!') // 'hello-world'
 */
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/[\s]+/g, "-") // Replace spaces with hyphens
        .replace(/[-]+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export const cn = (...classes: any[]) => {
    return classes.filter(Boolean).join(" ");
};

/**
 * Capitalize the first letter of a string
 * @example
 * capitalize('injectable') // 'Injectable'
 */
export const capitalize = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
};
