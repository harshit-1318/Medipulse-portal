import { Activity, Users, ShieldAlert, Cpu, LogIn, MessageSquare, History } from 'lucide-react';
import { StatTile } from './StatTile';

interface ActivityDashboardTilesProps {
    days: number;
    totals: {
        events: number;
        uniqueStaff: number;
        userEvents: number;
        systemEvents: number;
        legacyEvents: number;
        failedLogins: number;
        commActionsSent: number;
    };
}

export function ActivityDashboardTiles({ days, totals }: ActivityDashboardTilesProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            <StatTile
                label="Total Events"
                value={totals.events}
                sub={`last ${days} days`}
                icon={<Activity size={16} />}
                tooltip="All activity log entries in this period"
            />
            <StatTile
                label="Active Staff"
                value={totals.uniqueStaff}
                sub="unique staff emails"
                icon={<Users size={16} />}
                tooltip="Unique staff member email addresses with at least one user-initiated action (source='user'). Does not count customers."
            />
            <StatTile
                label="Staff Actions"
                value={totals.userEvents}
                sub="source = user"
                icon={<LogIn size={16} />}
                tooltip="Events explicitly created by a logged-in staff member (source='user'). Logs from before May 2026 appear as Legacy Events."
            />
            <StatTile
                label="Comms Sent"
                value={totals.commActionsSent}
                sub="prescriber actions"
                icon={<MessageSquare size={16} />}
                tooltip="Total prescriber communication actions: video, prescription reminder, document reminder, 6-month review, customer message, GP correspondence"
                accent={totals.commActionsSent > 0 ? "border-emerald-200 bg-emerald-50" : undefined}
            />
            <StatTile
                label="System Events"
                value={totals.systemEvents}
                sub="source = system/store"
                icon={<Cpu size={16} />}
                tooltip="Background job events (email sends, store webhooks). Counts source='system' or store events."
            />
            <StatTile
                label="Legacy Events"
                value={totals.legacyEvents}
                sub="pre-May 2026"
                icon={<History size={16} />}
                tooltip="Events logged before the May 2026 metadata enrichment. No source tag — cannot be classified as staff or system."
                accent="border-slate-200 bg-slate-50"
            />
            <StatTile
                label="Failed Logins"
                value={totals.failedLogins}
                sub={`last ${days} days`}
                accent={totals.failedLogins > 0 ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}
                icon={<ShieldAlert size={16} className={totals.failedLogins > 0 ? "text-red-500" : "text-slate-400"} />}
                tooltip="Total failed login attempts in the selected period."
            />
        </div>
    );
}
