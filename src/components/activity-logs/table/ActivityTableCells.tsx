
import { getRoleBadgeConfig } from "../utils/roleBadgeConfig";

interface ActivityActionCellProps {
    config: any;
    Icon: any;
    count?: number;
}

export const ActivityActionCell = ({ config, Icon, count }: ActivityActionCellProps) => {
    return (
        <td className="px-5 py-4 align-middle">
            <div className="flex justify-center">
                <div
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm w-fit transition-all hover:shadow-md cursor-default group"
                    style={{ 
                        backgroundColor: config.bg, 
                        borderColor: config.border, 
                        color: config.color,
                    }}
                >
                    <div className="p-1 rounded-md bg-white/50 backdrop-blur-sm shadow-xs group-hover:scale-110 transition-transform">
                        <Icon size={12} strokeWidth={2.5} className="opacity-90" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap pr-1">{config.label}</span>
                    {count && count > 1 && (
                        <span
                            className="absolute -top-2 -right-2 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-black text-white shadow-sm border border-white/50"
                            style={{ backgroundColor: config.color }}
                            title={`Occurred ${count} times this day`}
                        >
                            {count}×
                        </span>
                    )}
                </div>
            </div>
        </td>
    );
};

interface ActivityUserCellProps {
    userName?: string;
    userEmail?: string;
    userRole?: string;
}

export const ActivityUserCell = ({ userName, userEmail, userRole }: ActivityUserCellProps) => {
    const roleConfig = userRole ? getRoleBadgeConfig(userRole) : null;

    return (
        <td className="px-5 py-3.5 align-middle text-center">
            <div className="flex flex-col items-center justify-center leading-tight">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-[14px] font-bold text-slate-900 tracking-tight">
                        {userName || "Unknown User"}
                    </span>
                    {roleConfig && (
                        <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                            style={{
                                backgroundColor: roleConfig.bg,
                                color: roleConfig.color,
                                borderColor: roleConfig.border,
                            }}
                        >
                            {roleConfig.label}
                        </span>
                    )}
                </div>
                <span className="text-[11px] font-medium text-slate-400 mt-1 truncate max-w-37.5">
                    {userEmail || "-"}
                </span>
            </div>
        </td>
    );
};
