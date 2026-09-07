export const getStickmanScale = (bmiDisplay: string) => {
    const bmi = parseFloat(bmiDisplay) || 0;
    const minBmi = 15;
    const maxBmi = 45;
    const clamped = Math.min(maxBmi, Math.max(minBmi, bmi));
    const ratio = (clamped - minBmi) / (maxBmi - minBmi);
    const zoneBoost = clamped >= 40 ? 0.42 : clamped >= 30 ? 0.28 : clamped >= 25 ? 0.14 : clamped < 18.5 ? -0.08 : 0;

    const torsoScale = Math.min(2, Math.max(0.62, 0.66 + ratio * 1.1 + zoneBoost));
    const limbScale = Math.min(1.95, Math.max(0.68, 0.74 + ratio * 0.78 + zoneBoost * 0.62));

    return {
        torsoScale,
        limbScale,
        offsetY: -0.3 - ratio * 0.7
    };
};
