import type { Product } from "@/components/order-details/types";
import { extractConsultationData } from "@/components/order-details/utils/consultation";
import { QuestionRowItem } from "./QuestionRowItem";

interface ConsultationQuestionsProps {
    product: Product;
    repeatedOrders?: number;
}

export const ConsultationQuestions = ({ product, repeatedOrders = 0 }: ConsultationQuestionsProps) => {
    const consultation = extractConsultationData(product);
    const questions = Object.entries(consultation.questions).map(([name, value]) => ({ name, value }));

    const isGPQuestion = (name: string) =>
        name.toLowerCase().includes("gp ") || name.toLowerCase().startsWith("gp_");

    const isReorderQuestion = (name: string) => {
        const n = name.toLowerCase();
        return (
            n.includes("reorder") ||
            n.includes("side effect") ||
            n.includes("side_effect") ||
            n.includes("changed since") ||
            n === "change"
        );
    };

    const filtered = questions.filter((q) => {
        const name = q.name?.toLowerCase() || "";
        return (
            name !== "height" &&
            name !== "weight" &&
            name !== "bmi" &&
            !name.includes("body mass index") &&
            !(name.includes("height") && (name.includes("cm") || name.length < 20)) &&
            !(name.includes("weight") && (name.includes("kg") || name.length < 20))
        );
    });

    const defaultQuestions = filtered.filter((q) => !isGPQuestion(q.name) && !isReorderQuestion(q.name));
    const gpQuestions = filtered.filter((q) => isGPQuestion(q.name));
    const reorderQuestions = filtered.filter((q) => isReorderQuestion(q.name));

    const renderGroupHeader = (key: string, title: string) => (
        <div key={key} className="consultation-group-header">
            <span className="consultation-group-title">{title}</span>
            <div className="consultation-group-line" />
        </div>
    );

    return (
        <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-2 px-1">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50 shadow-sm">
                    <span className="text-[14px]">📄</span>
                </div>
                <div>
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Consultation Protocol</h4>
                    <p className="text-[13px] font-bold text-slate-700">Patient Consultation Answers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 w-full gap-1">
                {filtered.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[12px] text-text-secondary font-medium">No consultation data recorded for this product.</p>
                    </div>
                ) : (
                    <>
                        {defaultQuestions.map((q, i) => (
                            <QuestionRowItem key={`${q.name}-${i}`} q={q} index={i} />
                        ))}

                        {gpQuestions.length > 0 && (
                            <>
                                {renderGroupHeader("gp-header", "GP Information")}
                                {gpQuestions.map((q, i) => (
                                    <QuestionRowItem key={`${q.name}-${i}`} q={q} index={i} />
                                ))}
                            </>
                        )}

                        {reorderQuestions.length > 0 && repeatedOrders > 0 && (
                            <>
                                {renderGroupHeader("reorder-header", "Re-Order Information")}
                                {reorderQuestions.map((q, i) => (
                                    <QuestionRowItem key={`${q.name}-${i}`} q={q} index={i} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
