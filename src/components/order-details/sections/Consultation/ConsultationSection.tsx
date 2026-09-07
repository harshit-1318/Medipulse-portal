import { useMemo } from 'react';
import { Clock } from "lucide-react";
import type { Product } from "@/components/order-details/types";
import { useBmiStatus } from "../bmi/hooks/useBmiStatus";
import { ConsultationTabs } from "./components/ConsultationTabs";
import { ConsultationQuestions } from "./components/ConsultationQuestions";
import { CurrentMeasurements, PreviousMeasurements } from "./components/ClinicalMeasurements";
import { getBmiDisplay, getHeightDisplay, getWeightDisplay, getPrevBmiDisplay, getPrevHeightDisplay, getPrevWeightDisplay, hasPrevMeasurements } from "@/components/order-details/utils";
import { useSortedConsultationProducts } from "./hooks/useSortedConsultationProducts";
import { useConsultationActiveProduct } from "./hooks/useConsultationActiveProduct";

interface ConsultationSectionProps {
    products: Product[];
    repeatedOrders?: number;
}

export function ConsultationSection({ products, repeatedOrders = 0 }: ConsultationSectionProps) {
    const sortedProducts = useSortedConsultationProducts(products);
    const { activeProductId, setActiveProductId, activeProduct } = useConsultationActiveProduct(sortedProducts);

    const bmiDisplay = activeProduct ? getBmiDisplay(activeProduct) : "-";
    const heightDisplay = activeProduct ? getHeightDisplay(activeProduct) : "-";
    const weightDisplay = activeProduct ? getWeightDisplay(activeProduct) : "-";
    const { bmiStatus } = useBmiStatus(bmiDisplay);

    const hasBmiData = heightDisplay !== "-" && weightDisplay !== "-";

    const showPrevMeasurements = activeProduct ? hasPrevMeasurements(activeProduct) : false;
    const prevBmiDisplay = activeProduct ? getPrevBmiDisplay(activeProduct) : "-";
    const prevHeightDisplay = activeProduct ? getPrevHeightDisplay(activeProduct) : "-";
    const prevWeightDisplay = activeProduct ? getPrevWeightDisplay(activeProduct) : "-";
    const { bmiStatus: prevBmiStatus } = useBmiStatus(prevBmiDisplay);

    const bmiDelta = useMemo(() => {
        if (!showPrevMeasurements) return null;
        const curr = parseFloat(bmiDisplay);
        const prev = parseFloat(prevBmiDisplay);
        if (isNaN(curr) || isNaN(prev)) return null;
        return +(curr - prev).toFixed(2);
    }, [bmiDisplay, prevBmiDisplay, showPrevMeasurements]);

    return (
        <div id="section-consultation" className="order-detail-card group">
            <div className="section-header justify-between">
                <div className="flex items-center gap-4">
                    <div className="section-icon-wrapper bg-blue-soft text-blue-600">
                        <Clock size={22} strokeWidth={2.5} />
                    </div>
                    <div className="section-title-container">
                        <h3 className="section-title">Consultation Details</h3>
                        <p className="section-subtitle">Product Specific Questions & Clinical Data</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <ConsultationTabs 
                    products={sortedProducts} 
                    activeProductId={activeProductId} 
                    onTabChange={setActiveProductId} 
                />

                {!activeProduct ? (
                    <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                            <Clock size={24} />
                        </div>
                        <p className="text-[13px] text-text-secondary font-medium">No consultation data found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {hasBmiData && (
                            <CurrentMeasurements
                                bmiDisplay={bmiDisplay}
                                bmiStatus={bmiStatus}
                                showPrevMeasurements={showPrevMeasurements}
                                prevBmiStatus={prevBmiStatus}
                                bmiDelta={bmiDelta}
                                heightDisplay={heightDisplay}
                                weightDisplay={weightDisplay}
                            />
                        )}

                        {showPrevMeasurements && (
                            <PreviousMeasurements
                                prevBmiDisplay={prevBmiDisplay}
                                prevBmiStatus={prevBmiStatus}
                                prevHeightDisplay={prevHeightDisplay}
                                prevWeightDisplay={prevWeightDisplay}
                            />
                        )}

                        <ConsultationQuestions product={activeProduct} repeatedOrders={repeatedOrders} />
                    </div>
                )}
            </div>
        </div>
    );
}
