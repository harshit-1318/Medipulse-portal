import { Eye, Pencil } from 'lucide-react';
import type { Site } from "@/types/site";

interface SitesOverviewTableProps {
    sites: Site[];
    loading: boolean;
}

export function SitesOverviewTable({ sites, loading }: SitesOverviewTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">Sites List</h2>
                        <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {sites.length}
                        </span>
                    </div>
                    <div className="w-12 h-[3px] bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1.5 rounded-full shadow-sm" />
                </div>
                <p className="text-xs text-slate-500">No customer or medical data is shown here.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]">
                    <thead className="bg-[#f8fafc] text-slate-800 border-b border-slate-100">
                        <tr>
                            <th className="px-5 py-4 text-left font-extrabold text-[13px] uppercase tracking-wider text-[#003B73]/80">Site Name</th>
                            <th className="px-5 py-4 text-left font-extrabold text-[13px] uppercase tracking-wider text-[#003B73]/80">Domain</th>
                            <th className="px-5 py-4 text-left font-extrabold text-[13px] uppercase tracking-wider text-[#003B73]/80">Status</th>
                            <th className="px-5 py-4 text-left font-extrabold text-[13px] uppercase tracking-wider text-[#003B73]/80">Users</th>
                            <th className="px-5 py-4 text-left font-extrabold text-[13px] uppercase tracking-wider text-[#003B73]/80">Created</th>
                            <th className="px-5 py-4 text-left font-extrabold text-[13px] uppercase tracking-wider text-[#003B73]/80">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {loading ? (
                            <tr>
                                <td className="px-5 py-6 text-slate-500" colSpan={6}>Loading dashboard...</td>
                            </tr>
                        ) : sites.length === 0 ? (
                            <tr>
                                <td className="px-5 py-6 text-slate-500" colSpan={6}>No sites found.</td>
                            </tr>
                        ) : (
                            sites.map((site) => (
                                <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4 font-medium text-slate-900">{site.name}</td>
                                    <td className="px-5 py-4 text-slate-600">{site.url || site.primaryDomain || "-"}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${site.status === "active"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {site.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-700">{site.totalUsers ?? 0}</td>
                                    <td className="px-5 py-4 text-slate-600">
                                        {site.createdAt ? new Date(site.createdAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <a href={`/sites/${site.id}`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                                <Eye size={13} />
                                                View
                                            </a>
                                            <a href={`/sites/${site.id}/edit`} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                                <Pencil size={13} />
                                                Edit
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
