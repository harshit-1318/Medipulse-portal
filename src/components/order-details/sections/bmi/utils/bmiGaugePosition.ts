import type { BmiProfile } from "./bmiProfile";

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export const getGaugePositionPercent = (val: number, profile: BmiProfile): string => {
    const bmi = clamp(Number.isFinite(val) ? val : 0, 0, 80);
    let position = 0;

    if (profile === "ethnicity-adjusted") {
        if (bmi < 18.5) {
            position = (bmi / 18.5) * 18.5;
        } else if (bmi < 23) {
            position = 18.5 + ((bmi - 18.5) / (23 - 18.5)) * 4.5;
        } else if (bmi < 27.5) {
            position = 23 + ((bmi - 23) / (27.5 - 23)) * 4.5;
        } else {
            const capped = clamp(bmi, 27.5, 45);
            position = 27.5 + ((capped - 27.5) / (45 - 27.5)) * 72.5;
        }
    } else {
        if (bmi < 18.5) {
            position = (bmi / 18.5) * 18.5;
        } else if (bmi < 25) {
            position = 18.5 + ((bmi - 18.5) / (25 - 18.5)) * 6.5;
        } else if (bmi < 30) {
            position = 25 + ((bmi - 25) / (30 - 25)) * 5;
        } else if (bmi < 40) {
            position = 30 + ((bmi - 30) / (40 - 30)) * 10;
        } else {
            const capped = clamp(bmi, 40, 55);
            position = 40 + ((capped - 40) / (55 - 40)) * 60;
        }
    }

    return `${clamp(position, 0, 100).toFixed(1)}%`;
};
