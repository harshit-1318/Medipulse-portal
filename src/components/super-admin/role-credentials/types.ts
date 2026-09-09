import type { RoleCredentialUser, RoleCredentialsStats, RoleCredentialsPagination } from '@/api/services/super-admin/role-credentials';

export type { RoleCredentialUser, RoleCredentialsStats, RoleCredentialsPagination };

export interface CredentialsFiltersState {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sort: string;
}

export interface CredentialsSortingState {
  sortBy: string;
  sort: 'asc' | 'desc';
}

export interface RoleBadgeConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  iconName: string;
}

export interface UserDetailsDrawerState {
  isOpen: boolean;
  user: RoleCredentialUser | null;
}

export interface ResetPasswordModalState {
  isOpen: boolean;
  user: RoleCredentialUser | null;
  generatedPassword?: string;
}

export interface EditUserModalState {
  isOpen: boolean;
  user: RoleCredentialUser | null;
}

export interface PasswordRevealState {
  isConfirmOpen: boolean;
  targetUser: RoleCredentialUser | null;
  revealedUserId: string | null;
  revealedPassword: string | null;
  secondsRemaining: number;
}
