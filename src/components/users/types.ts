export type UserRole = 'super_admin' | 'admin' | 'driver' | 'prescriber' | 'pharmacy_staff' | 'user' | 'customer' | 'customer_support' | string;

export interface Site {
    _id: string;
    site_key: string;
    site_name: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    is_active?: boolean;
    site_id?: string;
    sites: string[];
    createdAt: string;
    is_super_admin?: boolean;
    siteName?: string; // Enriched on frontend
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    site_id: string;
}

export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}
