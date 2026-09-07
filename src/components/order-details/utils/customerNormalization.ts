export function normalizeCustomerInfo(response: any) {
    const dobFromCustomerInfo = response.customerInfo?.dob;

    return {
        id: response.customerInfo?.id,
        name: response.customerInfo?.name ?? "",
        email: response.customerInfo?.email ?? "",
        address: response.customerInfo?.address ?? "",
        defaultAddress: response.customerInfo?.default_address ?? response.default_address ?? null,
        totalOrders: Number(response.customerInfo?.totalOrders ?? 0),
        dob: typeof dobFromCustomerInfo === "string" && dobFromCustomerInfo.trim().length > 0
            ? dobFromCustomerInfo
            : extractDob(response.products),
    };
}

function extractDob(products: any[]): string | null {
    if (!Array.isArray(products)) return null;
    const product = products.find(p => p.consultationQuestions?.length);
    if (!product) return null;
    const dobQ = product.consultationQuestions.find((q: any) => {
        const name = q.name?.toLowerCase() || "";
        return name === "dob" || name === "date of birth" || name.includes("date of birth");
    });
    return dobQ?.value || null;
}
