export const normalizeValue = (value: unknown): string => {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
};

export const hasUsableOrderId = (orderId: string): boolean => {
    if (!orderId) return false;
    const lowered = orderId.toLowerCase();
    return lowered !== "0" && lowered !== "null" && lowered !== "undefined" && lowered !== "-";
};

export function groupActivityRows(rows: any[]) {
    const groupedRows = new Map<string, any[]>();
    const noOrderRows: any[] = [];

    for (const row of rows) {
        const orderId = normalizeValue(row.original?.orderId);
        if (!hasUsableOrderId(orderId)) {
            noOrderRows.push(row);
            continue;
        }
        if (!groupedRows.has(orderId)) {
            groupedRows.set(orderId, []);
        }
        groupedRows.get(orderId)!.push(row);
    }

    const noOrderRowsByUser = new Map<string, { label: string; rows: any[] }>();
    for (const row of noOrderRows) {
        const userEmail = normalizeValue(row.original?.userEmail).toLowerCase();
        const userName = normalizeValue(row.original?.userName);
        const userKey = userEmail || userName || "unknown-user";
        const userLabel = userEmail || userName || "Unknown User";

        if (!noOrderRowsByUser.has(userKey)) {
            noOrderRowsByUser.set(userKey, { label: userLabel, rows: [] });
        }
        noOrderRowsByUser.get(userKey)!.rows.push(row);
    }

    return { groupedRows, noOrderRowsByUser };
}
