
interface Props {
    total: number;
}

export default function RecordCount({ total }: Props) {
    return (
        <div className="inline-flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
            <div className="flex items-center gap-2.5">
                <h2 className="text-[17px] font-semibold text-[#003B73] tracking-tight">
                    Customers List
                </h2>
                <span className="bg-blue-50 text-[#003B73] text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    {total}
                </span>
            </div>

            {/* Signature Prescriptions-style Gradient Accent */}
            <div className="w-12 h-[3px] bg-linear-to-r from-[#00B3CC] to-[#003B73] mt-1.5 rounded-full shadow-sm" />
        </div>
    );
}
