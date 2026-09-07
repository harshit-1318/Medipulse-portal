export function getRolePermissions(role: string): string[] {
  switch (role?.toLowerCase()) {
    case 'super_admin':
      return ['*'];
    case 'admin':
      return ['admin:*', 'orders:*', 'prescriptions:*', 'customers:*', 'surveys:*', 'leads:*', 'docman:*', 'activity_logs:*', 'queue_monitor:*'];
    case 'prescriber':
      return ['prescriber:orders', 'prescriber:prescriptions', 'prescriber:customers', 'prescriptions:write'];
    case 'pharmacist':
      return ['pharmacist:orders', 'pharmacist:prescriptions', 'pharmacist:customers', 'orders:dispense'];
    case 'pharmacy_staff':
      return ['pharmacy_staff:orders', 'pharmacy_staff:prescriptions', 'orders:pack'];
    case 'customer_support':
      return ['support:orders', 'support:customers', 'support:leads', 'communication:send'];
    case 'driver':
      return ['driver:orders', 'orders:delivery'];
    case 'customer':
    case 'user':
      return ['customer:orders', 'customer:profile'];
    default:
      return ['user:read'];
  }
}
