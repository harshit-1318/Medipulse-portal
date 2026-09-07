import type { ApiResponse } from "../types";

export function formatAddress(defaultAddress: ApiResponse["customerInfo"]["defaultAddress"]) {
    if (!defaultAddress) return null;

    const { address1, address2, city, zip, country } = defaultAddress;

    const parts = [address1, address2, city, country, zip].filter((p) => p && p !== "null" && p !== "undefined");

    const formatted = parts.join(", ");

    return formatted;
}

export function cleanAddress(address: string, customerName: string) {
    if (!address) return "-";
    if (!address.includes(",")) return address;

    const parts = address.split(",").map((s) => s.trim());
    const lowerName = customerName.toLowerCase();
    const nameParts = lowerName.split(" ").filter((p) => p.length > 2); // only filter longer name parts

    const uniqueParts = new Set<string>();
    const cleaned: string[] = [];

    parts.forEach((part) => {
        const lower = part.toLowerCase();

        // 1. Filter Long IDs (pure digits, > 12 chars)
        if (/^\d{13,}$/.test(part)) return;

        // 2. Filter Booleans
        if (lower === "true" || lower === "false") return;

        // 3. Filter Name duplications (more robust)
        if (lower === lowerName) return;
        if (nameParts.some((np) => lower.includes(np))) return;

        // 4. Filter empty or "null" strings
        if (!part || lower === "null" || lower === "undefined") return;

        // 5. Filter Phone numbers (starting with '+' or more than 10 digits)
        if (part.startsWith("+") || /^\d{10,}$/.test(part.replace(/\s+/g, ""))) return;

        // 6. Uniquify
        if (!uniqueParts.has(lower)) {
            uniqueParts.add(lower);
            cleaned.push(part);
        }
    });

    return cleaned.join(", ");
}

export const capitalizeName = (name: string) => {
    return name
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};
