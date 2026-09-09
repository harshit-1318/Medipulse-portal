export function applyDateAndCategoryFilters(params: any, filters: any) {
    if (filters.fulfillmentStatus) params.fulfillmentStatus = String(filters.fulfillmentStatus).toLowerCase().replace(/[\s-]+/g, "_");
    if (filters.startDate) {
        const [y, m, d] = filters.startDate.split('-').map(Number);
        params.start_date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0)).toISOString();
    }
    if (filters.endDate) {
        const [y, m, d] = filters.endDate.split('-').map(Number);
        params.end_date = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999)).toISOString();
    }
    if (filters.category) {
        params.product_category = filters.category;
    } else if (filters.productCategory) {
        params.product_category = filters.productCategory;
    }
    if (filters.productName) params.productName = filters.productName;
    
    if (filters.search && filters.type !== "customers") params.search = filters.search;

    if (filters.documents) {
        const isUploaded = filters.documents === "Uploaded";
        params.documentStatus = isUploaded ? "uploaded" : "not_uploaded";
    }

    if (filters.products) params.product_type = String(filters.products).toLowerCase();

    if (filters.repeatedOrders === "repeat") {
        params.order_type = "repeat";
        params.repeatedOrders = "repeat";
    } else if (filters.repeatedOrders === "first") {
        params.order_type = "first";
        params.repeatedOrders = "first";
    } else if (filters.repeatedOrders && filters.repeatedOrders !== "all" && filters.repeatedOrders !== "") {
        params.order_type = filters.repeatedOrders;
        params.repeatedOrders = filters.repeatedOrders;
    }
}
