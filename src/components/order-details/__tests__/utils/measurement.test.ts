import { describe, it, expect } from 'vitest';
import {
    getHeightDisplay,
    getWeightDisplay,
    getBmiDisplay,
} from '../../utils/measurement';

describe('Measurement Utilities', () => {
    describe('getHeightDisplay', () => {
        it.each([
            [{ heightData: [{ name: 'height (cm)', value: '170' }, { name: 'ft', value: '5' }, { name: 'in', value: '7' }] }, '170 cm'],
            [{ heightData: [{ name: 'Height (cm)', value: '172' }] }, '172 cm'],
            [{ heightData: [{ name: 'ft', value: '5' }, { name: 'in', value: '7' }] }, '5 FT 7 IN'],
            [{ heightData: [{ name: 'heightUnit', value: 'imperial' }, { name: 'ft', value: '5' }, { name: 'in', value: '7' }] }, '5 FT 7 IN'],
            [{ heightData: [{ name: 'Height', value: '5 FT 10 IN' }] }, '5 FT 10 IN'],
            [{ heightData: [{ name: 'cm', value: 180 }] }, '180 cm'],
            [{ consultationQuestions: [{ name: 'Height (cm)', value: '175' }] }, '175'],
            [{}, '-'],
        ])('returns expected display %s', (product, expected) => {
            expect(getHeightDisplay(product as any)).toBe(expected);
        });
    });

    describe('getWeightDisplay', () => {
        it.each([
            [{ weightData: [{ name: 'weight (kg)', value: '77' }, { name: 'st', value: '14' }] }, '77 kg'],
            [{ weightData: [{ name: 'Weight (kg)', value: '80' }] }, '80 kg'],
            [{ weightData: [{ name: 'st', value: '14' }] }, '14 ST'],
            [{ weightData: [{ name: 'st', value: '12' }, { name: 'lb', value: '7' }] }, '12 ST 7 LB'],
            [{ weightData: [{ name: 'Weight', value: '16 ST' }] }, '16 ST'],
            [{ weightData: [{ name: 'kg', value: 85 }] }, '85 kg'],
            [{ consultationQuestions: [{ name: 'Weight (kg)', value: '80' }] }, '80'],
            [{}, '-'],
        ])('returns expected weight %s', (product, expected) => {
            expect(getWeightDisplay(product as any)).toBe(expected);
        });
    });

    describe('getBmiDisplay', () => {
        it.each([
            [{ bmiData: [{ name: 'bmi', value: 26.64 }] }, '26.64'],
            [{ bmiData: [{ name: 'BMI', value: 25.4 }] }, '25.40'],
            [{ heightData: [{ name: 'cm', value: 180 }], weightData: [{ name: 'kg', value: 81 }] }, '25.00'],
            [{ heightData: [{ name: 'height (cm)', value: '170' }], weightData: [{ name: 'weight (kg)', value: '77' }], bmiData: [] }, '26.64'],
            [{ bmiData: [{ name: 'bmi', value: '26.64' }], heightData: [{ name: 'height (cm)', value: '170' }], weightData: [{ name: 'weight (kg)', value: '77' }] }, '26.64'],
            [{ heightData: [{ name: 'ft', value: '5' }, { name: 'in', value: '7' }], weightData: [{ name: 'st', value: '14' }] }, '30.70'],
            [{ heightData: [{ name: 'Height', value: '5 FT 10 IN' }], weightData: [{ name: 'Weight', value: '16 ST' }] }, '32.14'],
            [{ heightData: [{ name: 'cm', value: '180' }], weightData: [{ name: 'Weight', value: '12 ST 7 LB' }] }, '24.50'],
            [{}, '-'],
        ])('returns expected BMI %s', (product, expected) => {
            expect(getBmiDisplay(product as any)).toBe(expected);
        });
    });
});
