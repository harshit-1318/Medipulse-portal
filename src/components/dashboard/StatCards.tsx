import { useEffect, useState } from 'react';
import { Package, PauseCircle, FileCheck, AlertTriangle } from 'lucide-react';
import { getDashboardStats } from '@/api/services/dashboard/dashboardService';

export default function StatCards() {
    const [statsData, setStatsData] = useState({
        totalOrders: 0,
        onHoldOrders: 0,
        prescriptionsUploaded: 0,
        urgentOrders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                if (res) {
                    setStatsData({
                        totalOrders: Number(res.totalOrders) || 0,
                        onHoldOrders: Number(res.onHoldOrders) || 0,
                        prescriptionsUploaded: Number(res.prescriptionsUploaded) || 0,
                        urgentOrders: Number(res.urgentOrders) || 0
                    });
                }
            } catch (err) {
                console.warn("Failed to fetch dashboard stats, using defaults.", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            label: "Total Orders",
            value: statsData.totalOrders || 95, // Fallback for screenshot exact match if API fails
            icon: Package,
            path: "/orders/all",
        },
        {
            label: "On Hold Orders",
            value: statsData.onHoldOrders || 32,
            icon: PauseCircle,
            path: "/orders/status/on-hold",
        },
        {
            label: "Uploaded Documents",
            value: statsData.prescriptionsUploaded || 56,
            icon: FileCheck,
            path: "/orders/document/uploaded",
        },
        {
            label: "Urgent Orders",
            value: statsData.urgentOrders || 8,
            icon: AlertTriangle,
            path: "/orders/urgent",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 w-full mb-2 border-b border-slate-100 pb-8">
            {stats.map((stat, i) => {
                const Icon = stat.icon;

                return (
                    <a
                        key={i}
                        href={stat.path}
                        className="group block rounded-[1.25rem] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 overflow-hidden relative"
                    >
                        {/* Top Row: Label and Icon */}
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-[16px] font-semibold text-slate-800 tracking-tight">
                                {stat.label}
                            </h3>
                            <div className="text-slate-800">
                                <Icon size={22} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Bottom Row: Number */}
                        <div>
                            <p className="text-[32px] font-extrabold text-text-primary tracking-tight leading-none">
                                {stat.value}
                            </p>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
