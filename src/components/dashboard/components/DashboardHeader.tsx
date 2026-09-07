import { useUserInfo } from '@/store';

export function DashboardHeader() {
    const user = useUserInfo();
    const role = (user?.effectiveRole || user?.role || '').toLowerCase();

    const getDashboardTitle = () => {
        switch (role) {
            case 'admin':
                return 'Admin Operations Dashboard';
            case 'prescriber':
                return 'Clinical & Prescriptions Dashboard';
            case 'pharmacist':
                return 'Pharmacy Dispensing Dashboard';
            case 'pharmacy_staff':
                return 'Pharmacy Operations Dashboard';
            case 'customer_support':
                return 'Customer Support Dashboard';
            case 'driver':
                return 'Logistics & Deliveries Dashboard';
            case 'customer':
            case 'user':
                return 'Customer Account Dashboard';
            default:
                return 'Dashboard Overview';
        }
    };

    return (
        <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
            {getDashboardTitle()}
        </h1>
    );
}
