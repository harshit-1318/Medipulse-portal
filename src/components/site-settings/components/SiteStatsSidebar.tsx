import { Activity, Package, Users } from "lucide-react";

interface Props {
    dashboardStats: any;
    loadingStats: boolean;
}

export const SiteStatsSidebar: React.FC<Props> = ({ dashboardStats, loadingStats }) => {
    const statCards = [
        {
            label: "Orders",
            value: dashboardStats?.stats?.orders ?? 0,
            icon: <Package className="h-6 w-6" />,
            bg: "bg-purple-50 text-purple-600",
            border: "border-purple-100"
        },
        {
            label: "Customers",
            value: dashboardStats?.stats?.customers ?? 0,
            icon: <Users className="h-6 w-6" />,
            bg: "bg-emerald-50 text-emerald-600",
            border: "border-emerald-100"
        },
        {
            label: "Activities",
            value: dashboardStats?.stats?.activities ?? 0,
            icon: <Activity className="h-6 w-6" />,
            bg: "bg-blue-50 text-blue-600",
            border: "border-blue-100"
        },
    ];

    return (
        <div className="h-full">
            <div className="flex flex-col gap-4 h-full">
                {statCards.map((card, idx) => (
                    <div key={idx} className="flex-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
                        <div className={`p-4 rounded-xl shrink-0 ${card.bg} border ${card.border} shadow-xs`}>
                            {card.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2 truncate">{card.label}</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 leading-none truncate">
                                {loadingStats ? "..." : card.value.toLocaleString()}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
