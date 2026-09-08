import { describe, it, expect } from 'vitest';
import {
    getPrevHeightDisplay,
    getPrevWeightDisplay,
    getPrevBmiDisplay,
    hasPrevMeasurements,
} from '../../utils/measurement';

describe('Previous Measurements Utilities', () => {
    it('returns prev height value or default hyphen', () => {
        expect(getPrevHeightDisplay({ prevHeightData: [{ name: 'prev height (cm)', value: '170' }] })).toBe('170');
        expect(getPrevHeightDisplay({})).toBe('-');
        expect(getPrevHeightDisplay({ prevHeightData: [] })).toBe('-');
    });

    it('returns prev weight value or default hyphen', () => {
        expect(getPrevWeightDisplay({ prevWeightData: [{ name: 'prev weight (kg)', value: '77' }] })).toBe('77');
        expect(getPrevWeightDisplay({})).toBe('-');
    });

    it('returns stored prev bmi or calculates from prev height and weight', () => {
        expect(getPrevBmiDisplay({ prevBmiData: [{ name: 'prev bmi', value: '26.64' }] })).toBe('26.64');

        const calculated = {
            prevHeightData: [{ name: 'prev height (cm)', value: '170' }],
            prevWeightData: [{ name: 'prev weight (kg)', value: '77' }],
        };
        expect(getPrevBmiDisplay(calculated)).toBe('26.64');
        expect(getPrevBmiDisplay({})).toBe('-');
    });

    it('checks if previous measurements exist', () => {
        expect(hasPrevMeasurements({ prevBmiData: [{ name: 'prev bmi', value: '26.64' }] })).toBe(true);
        expect(hasPrevMeasurements({ prevHeightData: [{ name: 'prev height (cm)', value: '170' }] })).toBe(true);
        expect(hasPrevMeasurements({})).toBe(false);
        expect(hasPrevMeasurements({ prevBmiData: [], prevHeightData: [], prevWeightData: [] })).toBe(false);
    });
});
