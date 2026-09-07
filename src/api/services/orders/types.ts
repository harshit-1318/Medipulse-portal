/* -----------------------------------------------------
 Customer Type
----------------------------------------------------- */
export interface Customer {
    id: number | string;
    first_name: string;
    last_name: string;
    email: string;
}
/* ---------------------
  Order Type Definition 
------------------------ */
export interface OrderProduct {
    name: string;
    quantity?: number;
    price?: string | number;
}

export interface OrderDocumentItemsStatus {
    id: boolean;
    fullPhoto: boolean;
    video: boolean;
}

export interface OrderInternalNote {
    note: string;
    createdAt?: string;
    user_id?: string | { name: string; _id: string };
}

export interface OrderType {
    [x: string]: any;
    id: string;
    date: string;
    updatedAt: string;
    status: string;
    customer: string | Customer | null;
    products: string | OrderProduct[];
    product?: string;
    category?: string;
    documents: string | null;
    repeatedOrders: number;
    isUrgent: boolean;
    isParked: boolean;
    tags: string[] | string;
    shopify_order_id?: string;
    documentsUploaded?: boolean;
    documentItemsStatus?: OrderDocumentItemsStatus;
    internalNotes?: OrderInternalNote[];
}

export interface ActivityLog {
    id: string;
    view: string;
    actionType: string;
    objectGuid: string;
    subjectGuid: string;
    targetGuid: string;
    accessId: string | number;
    userEmail: string;
    details: string;
    createdAt: string;
}

/*  Order Details Type */
export interface OrderDetails {
    _id?: string;
    shopify_order_id: string;
    shopifyOrderId?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
    total_price?: string | number;

    customer?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
    };

    line_items?: Array<{
        id: string | number;
        title: string;
        quantity: number;
        price: string | number;
        image?: string;
    }>;

    activityLogs?: ActivityLog[];
}

export interface CancelOrderPayload {
    orderId: string;
    reason: string;
    staff_note: string;
}
