import { useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { QueryProvider } from '@/components/common/QueryProvider';
import LeadDetailDrawer from './lead-drawer/LeadDetailDrawer';
import { useLeads } from './hooks/useLeads';
import { LeadsTable } from './table/LeadsTable';
import { STATUS_TABS, StatsStrip } from './components/StatsStrip';

function LeadsContent() {
    const { data, loading, stats, page, setPage, filters, setStatusFilter, setSearch } = useLeads();
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState('');

    return (
        <LazyMotion features={domAnimation}>
            <div className="space-y-6 font-montserrat pt-2 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Leads / CRM</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {data?.total ?? 0} lead{(data?.total ?? 0) !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <StatsStrip stats={stats} />

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                        {STATUS_TABS.map(({ label, value }) => (
                            <button
                                key={value}
                                onClick={() => setStatusFilter(value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    filters.status === value
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 min-w-50">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
                            placeholder="Search by customer name or email…"
                            className="w-full text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                        />
                    </div>
                </div>

                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <LeadsTable
                        items={data?.items}
                        total={data?.total ?? 0}
                        page={page}
                        loading={loading}
                        onPageChange={setPage}
                        onSelectLead={setSelectedLeadId}
                    />
                </m.div>
            </div>

            <LeadDetailDrawer
                leadId={selectedLeadId}
                onClose={() => setSelectedLeadId(null)}
            />
        </LazyMotion>
    );
}

export default function LeadsPage() {
    return (
        <QueryProvider>
            <LeadsContent />
        </QueryProvider>
    );
}

