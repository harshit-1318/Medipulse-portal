import type { Product } from "@/components/order-details/types";
import { extractConsultationData } from "@/components/order-details/utils/consultation";

interface Props {
    mainProduct: Product;
}

export const BmiQuestions = ({ mainProduct }: Props) => {
    const consultation = extractConsultationData(mainProduct);
    const questions = Object.entries(consultation.questions).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-4 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-soft flex items-center justify-center">
                    <span className="text-sm">📋</span>
                </div>
                <h4 className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Patient Declared Answers</h4>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {questions.map((q) => {
                    const val = String(q.value || "");
                    const lower = val.toLowerCase();
                    const isYes = lower === "yes";
                    const isNo = lower === "no";

                    return (
                        <div key={q.name} className="flex items-start justify-between py-2.5 px-3 hover:bg-slate-50/50 rounded-lg transition-colors border-b border-slate-50 last:border-0 group/row gap-4">
                            <span className="text-[13px] font-medium text-slate-600 group-hover/row:text-slate-900 transition-colors pt-0.5 leading-snug">{q.name}</span>
                            <span className={`status-badge shrink-0 mt-0.5 ${isYes ? 'badge-success' :
                                    isNo ? 'badge-error' :
                                        'badge-neutral'
                                }`}>
                                <span className="status-badge-dot" />
                                {val}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
