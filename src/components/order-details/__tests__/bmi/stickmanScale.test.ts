import { describe, it, expect } from 'vitest';
import { getStickmanScale } from '../../sections/bmi/utils/stickmanScale';

describe('getStickmanScale', () => {
    it('returns default scale when given an empty or invalid string', () => {
        const result = getStickmanScale('');
        expect(result.torsoScale).toBeGreaterThan(0);
        expect(result.limbScale).toBeGreaterThan(0);
        expect(result.offsetY).toBeDefined();
    });

    it('returns thinner scale at lower BMI and fuller scale at higher BMI', () => {
        const low = getStickmanScale('16');
        const mid = getStickmanScale('27');
        const high = getStickmanScale('42');

        expect(low.torsoScale).toBeLessThan(mid.torsoScale);
        expect(mid.torsoScale).toBeLessThan(high.torsoScale);
        expect(low.limbScale).toBeLessThan(high.limbScale);
    });

    it('clamps scale at min (15) and max (45) BMI bounds', () => {
        const below = getStickmanScale('1');
        const atMin = getStickmanScale('15');
        const above = getStickmanScale('100');
        const atMax = getStickmanScale('45');

        expect(below).toEqual(atMin);
        expect(above).toEqual(atMax);
    });

    it('shows visibly thicker scale for overweight than normal', () => {
        const normal = getStickmanScale('24.35');
        const overweight = getStickmanScale('28');
        expect(overweight.torsoScale - normal.torsoScale).toBeGreaterThan(0.14);
        expect(overweight.limbScale - normal.limbScale).toBeGreaterThan(0.08);
    });
});
