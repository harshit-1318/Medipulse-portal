import { extractConsultationData } from "./consultation";
import { calculateBmiFromStrings } from './bmiCalculators';
import {
    getPrevHeightDisplay,
    getPrevWeightDisplay,
    getPrevBmiDisplay,
    hasPrevMeasurements,
} from './prevMeasurements';

export {
    getPrevHeightDisplay,
    getPrevWeightDisplay,
    getPrevBmiDisplay,
    hasPrevMeasurements,
};

export function getHeightDisplay(mainProduct: any): string {
    if (mainProduct?.heightData?.length) {
        const metricEntry = mainProduct.heightData.find(
            (h: any) => String(h.name).toLowerCase() === 'height (cm)',
        );
        if (metricEntry?.value) {
            const v = String(metricEntry.value).trim();
            return v.toLowerCase().endsWith('cm') ? v : `${v} cm`;
        }

        const ftEntry = mainProduct.heightData.find((h: any) => String(h.name).toLowerCase() === 'ft');
        const inEntry = mainProduct.heightData.find((h: any) => String(h.name).toLowerCase() === 'in');
        if (ftEntry || inEntry) {
            return `${ftEntry?.value ?? 0} FT ${inEntry?.value ?? 0} IN`;
        }

        if (mainProduct.heightData.length === 1 && typeof mainProduct.heightData[0].value === 'string') {
            return String(mainProduct.heightData[0].value);
        }

        const cmEntry = mainProduct.heightData.find((h: any) => String(h.name).toLowerCase() === 'cm');
        if (cmEntry?.value) {
            const v = String(cmEntry.value).trim();
            return v.toLowerCase().endsWith('cm') ? v : `${v} cm`;
        }
    }

    const consultation = extractConsultationData(mainProduct);
    return consultation.height || "-";
}

export function getWeightDisplay(mainProduct: any): string {
    if (mainProduct?.weightData?.length) {
        const metricEntry = mainProduct.weightData.find(
            (w: any) => String(w.name).toLowerCase() === 'weight (kg)',
        );
        if (metricEntry?.value) {
            const v = String(metricEntry.value).trim();
            return v.toLowerCase().endsWith('kg') ? v : `${v} kg`;
        }

        const stEntry = mainProduct.weightData.find((w: any) => String(w.name).toLowerCase() === 'st');
        const lbEntry = mainProduct.weightData.find((w: any) => String(w.name).toLowerCase() === 'lb');
        if (stEntry || lbEntry) {
            const st = stEntry?.value ?? 0;
            const lb = lbEntry?.value ?? 0;
            return lb ? `${st} ST ${lb} LB` : `${st} ST`;
        }

        if (mainProduct.weightData.length === 1 && typeof mainProduct.weightData[0].value === 'string') {
            return String(mainProduct.weightData[0].value);
        }

        const kgEntry = mainProduct.weightData.find((w: any) => String(w.name).toLowerCase() === 'kg');
        if (kgEntry?.value) {
            const v = String(kgEntry.value).trim();
            return v.toLowerCase().endsWith('kg') ? v : `${v} kg`;
        }
    }

    const consultation = extractConsultationData(mainProduct);
    return consultation.weight || "-";
}

export function getBmiDisplay(mainProduct: any): string {
    if (mainProduct?.bmiData?.length) {
        const bmiVal =
            mainProduct.bmiData.find((b: any) => String(b.name).toLowerCase() === 'bmi')?.value ??
            mainProduct.bmiData[0]?.value;
        if (bmiVal) return Number(bmiVal).toFixed(2);
    }

    return calculateBmiFromStrings(getHeightDisplay(mainProduct), getWeightDisplay(mainProduct));
}
