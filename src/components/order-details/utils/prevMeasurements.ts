import { parseHeightToCm, parseWeightToKg } from './measurementParsers';

export function getPrevHeightDisplay(mainProduct: any): string {
    const entry = mainProduct?.prevHeightData?.[0];
    return entry?.value ? String(entry.value) : "-";
}

export function getPrevWeightDisplay(mainProduct: any): string {
    const entry = mainProduct?.prevWeightData?.[0];
    return entry?.value ? String(entry.value) : "-";
}

export function getPrevBmiDisplay(mainProduct: any): string {
    const entry = mainProduct?.prevBmiData?.[0];
    if (entry?.value) {
        const num = Number(entry.value);
        return isNaN(num) ? String(entry.value) : num.toFixed(2);
    }

    const prevH = mainProduct?.prevHeightData?.[0]?.value;
    const prevW = mainProduct?.prevWeightData?.[0]?.value;
    if (prevH && prevW) {
        const heightCm = parseHeightToCm(String(prevH));
        const weightKg = parseWeightToKg(String(prevW));
        if (heightCm && weightKg && heightCm > 0) {
            const bmi = weightKg / ((heightCm / 100) * (heightCm / 100));
            return bmi.toFixed(2);
        }
    }

    return "-";
}

export function hasPrevMeasurements(mainProduct: any): boolean {
    return (
        (mainProduct?.prevBmiData?.length ?? 0) > 0 ||
        (mainProduct?.prevHeightData?.length ?? 0) > 0 ||
        (mainProduct?.prevWeightData?.length ?? 0) > 0
    );
}
