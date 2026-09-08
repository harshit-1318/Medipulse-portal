import { describe, it, expect } from 'vitest';
import { getStickmanScale } from '../../sections/bmi/BmiGauge';
import { useBmiStatus } from '../../sections/bmi/hooks/useBmiStatus';

describe('useBmiStatus', () => {
    it('calculates correct status for standard BMI values', () => {
        expect(useBmiStatus("18.0").bmiStatus.label).toBe("Underweight");
        expect(useBmiStatus("22.0").bmiStatus.label).toBe("Normal");
        expect(useBmiStatus("27.0").bmiStatus.label).toBe("Overweight");
        expect(useBmiStatus("32.0").bmiStatus.label).toBe("Obese");
        expect(useBmiStatus("40.0").bmiStatus.label).toBe("Severely Obese");
    });

    it('uses lower thresholds and no severe label for ethnicity-adjusted profile', () => {
        expect(useBmiStatus("22.9", "ethnicity-adjusted").bmiStatus.label).toBe("Normal");
        expect(useBmiStatus("23.0", "ethnicity-adjusted").bmiStatus.label).toBe("Overweight");
        expect(useBmiStatus("27.5", "ethnicity-adjusted").bmiStatus.label).toBe("Obese");
        expect(useBmiStatus("45.0", "ethnicity-adjusted").bmiStatus.label).toBe("Obese");
    });

    it('keeps pointer positions aligned with corresponding zone boundaries', () => {
        const normalPos = parseFloat(useBmiStatus("24.35", "standard").bmiStatus.pos);
        const overweightPos = parseFloat(useBmiStatus("28", "standard").bmiStatus.pos);
        expect(normalPos).toBeGreaterThanOrEqual(18.5);
        expect(normalPos).toBeLessThan(25);
        expect(overweightPos).toBeGreaterThanOrEqual(25);
        expect(overweightPos).toBeLessThan(30);

        const adjustedOverweight = parseFloat(useBmiStatus("24.5", "ethnicity-adjusted").bmiStatus.pos);
        expect(adjustedOverweight).toBeGreaterThanOrEqual(23);
        expect(adjustedOverweight).toBeLessThan(27.5);
    });
});

describe('getStickmanScale', () => {
    it('scales torso and limbs proportionally with BMI and clamps at bounds', () => {
        const low = getStickmanScale('16');
        const mid = getStickmanScale('27');
        const high = getStickmanScale('42');
        expect(low.torsoScale).toBeLessThan(mid.torsoScale);
        expect(mid.torsoScale).toBeLessThan(high.torsoScale);
        expect(low.limbScale).toBeLessThan(high.limbScale);

        expect(getStickmanScale('1')).toEqual(getStickmanScale('15'));
        expect(getStickmanScale('100')).toEqual(getStickmanScale('45'));
    });

    it('shows visibly thicker scale for overweight than normal', () => {
        const normal = getStickmanScale('24.35');
        const overweight = getStickmanScale('28');
        expect(overweight.torsoScale - normal.torsoScale).toBeGreaterThan(0.14);
        expect(overweight.limbScale - normal.limbScale).toBeGreaterThan(0.08);
    });
});
