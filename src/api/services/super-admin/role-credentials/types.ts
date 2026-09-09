export interface RoleCredentialUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_super_admin: boolean;
  createdAt: string;
  lastLogin: string;
  hasPassword: boolean;
  permissions: string[];
}

export interface RoleCredentialsStats {
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  totalRoles: number;
}

export interface RoleCredentialsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleCredentialsParams {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface RoleCredentialsResponse {
  users: RoleCredentialUser[];
  stats: RoleCredentialsStats;
  pagination: RoleCredentialsPagination;
}

export interface RevealCredentialResponse {
  userId: string;
  email: string;
  revealedPassword: string;
}

export interface ResetPasswordResponse {
  userId: string;
  email: string;
  newPassword: string;
}
