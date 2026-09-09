import toast from 'react-hot-toast';

export const ROLE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor / Prescriber' },
  { value: 'nurse', label: 'Nurse / Pharmacy Staff' },
  { value: 'receptionist', label: 'Receptionist / Support' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'patient', label: 'Patient / Customer' },
  { value: 'driver', label: 'Driver' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export function formatCredentialDate(value?: string): string {
  if (!value || value === 'Never') return 'Never';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function copyToClipboard(text: string, label = 'Copied to clipboard'): void {
  if (!text) return;
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => toast.success(label),
      () => toast.error('Failed to copy')
    );
  }
}
