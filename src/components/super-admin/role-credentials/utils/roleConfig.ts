import type { RoleBadgeConfig } from '../types';

export const ROLE_CONFIGS: Record<string, RoleBadgeConfig> = {
  super_admin: {
    label: 'Super Admin',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-200/80',
    dotClass: 'bg-purple-500',
    iconName: 'Crown',
  },
  admin: {
    label: 'Admin',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/80',
    dotClass: 'bg-indigo-500',
    iconName: 'Shield',
  },
  doctor: {
    label: 'Doctor',
    bgClass: 'bg-teal-50',
    textClass: 'text-[#00a294]',
    borderClass: 'border-teal-200/80',
    dotClass: 'bg-[#00a294]',
    iconName: 'Stethoscope',
  },
  prescriber: {
    label: 'Doctor / Prescriber',
    bgClass: 'bg-teal-50',
    textClass: 'text-[#00a294]',
    borderClass: 'border-teal-200/80',
    dotClass: 'bg-[#00a294]',
    iconName: 'Stethoscope',
  },
  nurse: {
    label: 'Nurse',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/80',
    dotClass: 'bg-emerald-500',
    iconName: 'HeartPulse',
  },
  pharmacy_staff: {
    label: 'Nurse / Pharmacy Staff',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/80',
    dotClass: 'bg-emerald-500',
    iconName: 'HeartPulse',
  },
  receptionist: {
    label: 'Receptionist',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200/80',
    dotClass: 'bg-sky-500',
    iconName: 'Headphones',
  },
  customer_support: {
    label: 'Receptionist / Support',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200/80',
    dotClass: 'bg-sky-500',
    iconName: 'Headphones',
  },
  accountant: {
    label: 'Accountant',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200/80',
    dotClass: 'bg-amber-500',
    iconName: 'Coins',
  },
  patient: {
    label: 'Patient',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-300',
    dotClass: 'bg-slate-500',
    iconName: 'User',
  },
  customer: {
    label: 'Patient / Customer',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-300',
    dotClass: 'bg-slate-500',
    iconName: 'User',
  },
  driver: {
    label: 'Driver',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-200/80',
    dotClass: 'bg-orange-500',
    iconName: 'Truck',
  },
};

export function getRoleBadgeConfig(role: string, isSuper = false): RoleBadgeConfig {
  if (isSuper) return ROLE_CONFIGS.super_admin;
  const key = (role || '').toLowerCase();
  return (
    ROLE_CONFIGS[key] || {
      label: role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User',
      bgClass: 'bg-slate-50',
      textClass: 'text-slate-600',
      borderClass: 'border-slate-200/80',
      dotClass: 'bg-slate-400',
      iconName: 'User',
    }
  );
}
