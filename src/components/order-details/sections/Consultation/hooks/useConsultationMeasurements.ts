import { useMemo } from 'react';
import type { Product } from "@/components/order-details/types";
import { useBmiStatus } from "../../bmi";
import {
    getBmiDisplay,
    getHeightDisplay,
    getWeightDisplay,
    getPrevBmiDisplay,
    getPrevHeightDisplay,
    getPrevWeightDisplay,
    hasPrevMeasurements,
} from "@/components/order-details/utils";

export function useConsultationMeasurements(activeProduct: Product | null) {
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

    return {
        bmiDisplay,
        heightDisplay,
        weightDisplay,
        bmiStatus,
        hasBmiData,
        showPrevMeasurements,
        prevBmiDisplay,
        prevHeightDisplay,
        prevWeightDisplay,
        prevBmiStatus,
        bmiDelta,
    };
}
