interface DocmanJobsHeaderProps {
}

export default function DocmanJobsHeader({}: DocmanJobsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
                <h1 className="text-[22px] font-bold text-slate-900 mb-1 tracking-tight">
                    Docman Jobs
                </h1>
            </div>
        </div>
    );
}
