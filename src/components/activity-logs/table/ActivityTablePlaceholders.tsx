import { Activity } from "lucide-react";

export function TableSkeletonRows() {
    return (
        <tbody className="bg-white">
            {[...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-slate-50 last:border-0">
                    <td className="px-5 py-4">
                        <div className="flex justify-center">
                            <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-4 w-28 bg-slate-100 rounded"></div>
                            <div className="h-3 w-32 bg-slate-50 rounded"></div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex justify-center">
                            <div className="h-4 w-20 bg-slate-100 rounded"></div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex justify-center">
                            <div className="h-5 w-16 bg-slate-100 rounded-lg"></div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-4 w-24 bg-slate-100 rounded"></div>
                            <div className="h-3 w-16 bg-slate-50 rounded"></div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex justify-center">
                            <div className="h-8 w-8 bg-slate-100 rounded-xl"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export function TableEmptyState({ columnsCount }: { columnsCount: number }) {
    return (
        <tbody>
            <tr>
                <td colSpan={columnsCount} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-xs">
                            <Activity size={28} className="text-slate-300" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-slate-900">No activity logs found</p>
                            <p className="text-sm font-medium text-slate-400">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}
