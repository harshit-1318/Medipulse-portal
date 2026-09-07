export interface GlobalSearchOrder {
  shopify_order_id: number;
  order_name: string;
  email: string;
  customerName: string;
  status: string;
  createdAt: string;
  matchType: 'exact' | 'partial';
}

export interface GlobalSearchCustomer {
  customer_id: number;
  email: string;
  firstName: string;
  lastName: string;
  matchType: 'exact' | 'partial';
}

export interface GlobalSearchResponse {
  orders: GlobalSearchOrder[];
  customers: GlobalSearchCustomer[];
}
