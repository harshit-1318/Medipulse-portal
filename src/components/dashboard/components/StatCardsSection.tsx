import { StatCard } from "./StatCard";

interface StatCardsSectionProps {
    stats: any;
}

export function StatCardsSection({ stats }: StatCardsSectionProps) {
    const statCards = [
        {
            label: "Total Orders",
            value: Number(stats?.totalOrders) || 0,
            path: "/orders/all",
        },
        {
            label: "On Hold Orders",
            value: Number(stats?.onHoldOrders) || 0,
            path: "/orders/status/on-hold",
        },
        {
            label: "Uploaded Documents",
            value: Number(stats?.prescriptionsUploaded) || 0,
            path: "/orders/document/uploaded",
        },
        {
            label: "Urgent Orders",
            value: Number(stats?.urgentOrders) || 0,
            path: "/orders/urgent",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((item, index) => (
                <StatCard
                    key={index}
                    index={index}
                    label={item.label}
                    value={item.value}
                    path={item.path}
                    onTotalOrdersClick={(e) => {
                        e.preventDefault();
                        window.location.href = item.path;
                    }}
                />
            ))}
        </div>
    );
}
