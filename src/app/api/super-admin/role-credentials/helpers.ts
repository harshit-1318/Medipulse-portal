import { User, type IUser } from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export const KNOWN_DEFAULT_PASSWORD = 'Password123!';

export interface RoleCredentialItem {
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

export function buildRoleQueryFilter(search: string, role: string, status: string) {
  const filter: Record<string, any> = {};

  if (search.trim()) {
    const regex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }, { role: regex }];
  }

  if (role && role !== 'all') {
    const roleMap: Record<string, string[]> = {
      doctor: ['doctor', 'prescriber'],
      prescriber: ['doctor', 'prescriber'],
      nurse: ['nurse', 'pharmacy_staff'],
      pharmacy_staff: ['nurse', 'pharmacy_staff'],
      receptionist: ['receptionist', 'customer_support'],
      customer_support: ['receptionist', 'customer_support'],
      patient: ['patient', 'customer', 'user'],
      customer: ['patient', 'customer', 'user'],
    };
    const matched = roleMap[role.toLowerCase()] || [role.toLowerCase()];
    filter.role = { $in: matched };
  }

  if (status && status !== 'all') {
    filter.is_active = status === 'active';
  }

  return filter;
}

export function getSortDirective(sortBy: string, sortOrder: string) {
  const fieldMap: Record<string, string> = {
    name: 'name',
    role: 'role',
    email: 'email',
    status: 'is_active',
    createdAt: 'createdAt',
    lastLogin: 'updatedAt',
  };
  const key = fieldMap[sortBy] || 'createdAt';
  const dir = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
  return { [key]: dir } as Record<string, 1 | -1>;
}

export function deriveDisplayPassword(user: any): string {
  if (!user.password) return 'Password123!';
  if (bcrypt.compareSync(KNOWN_DEFAULT_PASSWORD, user.password)) {
    return KNOWN_DEFAULT_PASSWORD;
  }
  return user.password.startsWith('$2') ? 'Medipulse@Secure2026!' : user.password;
}
