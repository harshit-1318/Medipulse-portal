import { parseHeightToCm, parseWeightToKg } from './measurementParsers';

export function calculateBmiFromStrings(heightStr: string, weightStr: string): string {
    if (heightStr !== "-" && weightStr !== "-") {
        const heightCm = parseHeightToCm(heightStr);
        const weightKg = parseWeightToKg(weightStr);

        if (heightCm && weightKg && heightCm > 0) {
            const heightM = heightCm / 100;
            const bmi = weightKg / (heightM * heightM);
            return bmi.toFixed(2);
        }
    }
    return "-";
}
