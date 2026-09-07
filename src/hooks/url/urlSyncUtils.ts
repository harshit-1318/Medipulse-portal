export function getMappedValue(params: URLSearchParams, key: string): string | null {
    let value = params.get(key);
    if (value !== null) return value;

    const ALIASES: Record<string, string[]> = {
        customer: ["customerId", "customerName", "ustomerName"],
        orderId: ["id"],
        products: ["productName", "product_type"],
        status: ["orderStatus"],
        category: ["product_category"],
        startDate: ["start_date"],
        endDate: ["end_date"],
        repeatedOrders: ["order_type"],
        sort: ["sortDir"],
        documents: ["documentStatus"],
        limit: ["limit"]
    };

    const aliases = ALIASES[key];
    if (aliases) {
        for (const alias of aliases) {
            const aliasVal = params.get(alias);
            if (aliasVal !== null) return aliasVal;
        }
    }
    return null;
}

export function parseParamValue(value: string, key: string, currentStateValue: any): any {
    let parsedValue: any = value;

    if (key === 'documents') {
        if (value.toLowerCase() === 'uploaded') parsedValue = 'Uploaded';
        if (value.toLowerCase() === 'not_uploaded' || value.toLowerCase() === 'not uploaded') parsedValue = 'Not Uploaded';
    }

    if (typeof currentStateValue === 'boolean') return value === 'true';
    if (typeof currentStateValue === 'number') return Number(value);

    return parsedValue;
}
