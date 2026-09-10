
interface Props {
    total: number;
}

export default function RecordCount({ total }: Props) {
    return (
        <div className="inline-flex flex-col shrink-0">
            <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[#003B73] tracking-tight">
                    Customers List
                </h2>
                <span className="bg-blue-50 text-[#003B73] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                    {total}
                </span>
            </div>

            <div className="w-12 h-0.75 bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1 rounded-full" />
        </div>
    );
}
