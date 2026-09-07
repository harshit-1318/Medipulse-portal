export type Customer = {
    customerId: string;
    name: string;
    email: string;
    totalOrders: number;
    totalPens: number;
    createdAt: string;
};

export type CustomerFilters = {
    search?: string;
    totalPens?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sort?: "asc" | "desc";
    customerId?: string;
    customerEmail?: string;
    customerName?: string;
    customer_start_date?: string;
    isManualSort?: boolean;
};

export type CustomersResponse = {
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
};
