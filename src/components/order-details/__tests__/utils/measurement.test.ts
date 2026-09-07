import { describe, it, expect } from 'vitest';
import {
    getHeightDisplay,
    getWeightDisplay,
    getBmiDisplay,
    getPrevHeightDisplay,
    getPrevWeightDisplay,
    getPrevBmiDisplay,
    hasPrevMeasurements,
} from '../../utils/measurement';

describe('Measurement Utilities', () => {

    // ─── getHeightDisplay ────────────────────────────────────────────────────────

    describe('getHeightDisplay', () => {
        it('priority 1 — returns metric "height (cm)" value when present', () => {
            const product = {
                heightData: [
                    { name: 'height (cm)', value: '170' },
                    { name: 'ft', value: '5' },
                    { name: 'in', value: '7' },
                ],
            };
            expect(getHeightDisplay(product)).toBe('170 cm');
        });

        it('priority 1 — case-insensitive: "Height (cm)" also matches', () => {
            const product = {
                heightData: [{ name: 'Height (cm)', value: '172' }],
            };
            expect(getHeightDisplay(product)).toBe('172 cm');
        });

        it('priority 2 — reconstructs FT IN from separate ft and in Shopify properties', () => {
            const product = {
                heightData: [{ name: 'ft', value: '5' }, { name: 'in', value: '7' }],
            };
            expect(getHeightDisplay(product)).toBe('5 FT 7 IN');
        });

        it('priority 2 — handles heightUnit alongside ft/in (ignored in output)', () => {
            const product = {
                heightData: [
                    { name: 'heightUnit', value: 'imperial' },
                    { name: 'ft', value: '5' },
                    { name: 'in', value: '7' },
                ],
            };
            expect(getHeightDisplay(product)).toBe('5 FT 7 IN');
        });

        it('priority 3 — single pre-formatted string "5 FT 10 IN"', () => {
            const product = {
                heightData: [{ name: 'Height', value: '5 FT 10 IN' }],
            };
            expect(getHeightDisplay(product)).toBe('5 FT 10 IN');
        });

        it('priority 4 — cm numeric value', () => {
            const product = {
                heightData: [{ name: 'cm', value: 180 }],
            };
            expect(getHeightDisplay(product)).toBe('180 cm');
        });

        it('priority 5 — Q&A fallback via consultationQuestions', () => {
            const product = {
                consultationQuestions: [{ name: 'Height (cm)', value: '175' }],
            };
            expect(getHeightDisplay(product)).toBe('175');
        });

        it('returns "-" when no data at all', () => {
            expect(getHeightDisplay({})).toBe('-');
        });
    });

    // ─── getWeightDisplay ────────────────────────────────────────────────────────

    describe('getWeightDisplay', () => {
        it('priority 1 — returns metric "weight (kg)" value when present', () => {
            const product = {
                weightData: [
                    { name: 'weight (kg)', value: '77' },
                    { name: 'st', value: '14' },
                ],
            };
            expect(getWeightDisplay(product)).toBe('77 kg');
        });

        it('priority 1 — case-insensitive: "Weight (kg)" also matches', () => {
            const product = {
                weightData: [{ name: 'Weight (kg)', value: '80' }],
            };
            expect(getWeightDisplay(product)).toBe('80 kg');
        });

        it('priority 2 — reconstructs ST from a single st property', () => {
            const product = {
                weightData: [{ name: 'st', value: '14' }],
            };
            expect(getWeightDisplay(product)).toBe('14 ST');
        });

        it('priority 2 — reconstructs ST LB from separate st and lb properties', () => {
            const product = {
                weightData: [{ name: 'st', value: '12' }, { name: 'lb', value: '7' }],
            };
            expect(getWeightDisplay(product)).toBe('12 ST 7 LB');
        });

        it('priority 3 — single pre-formatted string "16 ST"', () => {
            const product = {
                weightData: [{ name: 'Weight', value: '16 ST' }],
            };
            expect(getWeightDisplay(product)).toBe('16 ST');
        });

        it('priority 4 — kg numeric value', () => {
            const product = {
                weightData: [{ name: 'kg', value: 85 }],
            };
            expect(getWeightDisplay(product)).toBe('85 kg');
        });

        it('priority 5 — Q&A fallback via consultationQuestions', () => {
            const product = {
                consultationQuestions: [{ name: 'Weight (kg)', value: '80' }],
            };
            expect(getWeightDisplay(product)).toBe('80');
        });

        it('returns "-" when no data at all', () => {
            expect(getWeightDisplay({})).toBe('-');
        });
    });

    // ─── getBmiDisplay ───────────────────────────────────────────────────────────

    describe('getBmiDisplay', () => {
        it('returns stored bmi value (lowercase name)', () => {
            const product = { bmiData: [{ name: 'bmi', value: 26.64 }] };
            expect(getBmiDisplay(product)).toBe('26.64');
        });

        it('returns stored bmi value — case-insensitive: "BMI" also matches', () => {
            const product = { bmiData: [{ name: 'BMI', value: 25.4 }] };
            expect(getBmiDisplay(product)).toBe('25.40');
        });

        it('calculates from cm + kg if bmiData absent', () => {
            const product = {
                heightData: [{ name: 'cm', value: 180 }],
                weightData: [{ name: 'kg', value: 81 }],
            };
            // getHeightDisplay returns '180 cm', getWeightDisplay returns '81 kg'
            // 81 / 1.8² = 25.00
            expect(getBmiDisplay(product)).toBe('25.00');
        });

        it('calculates from metric re-order properties (height (cm) + weight (kg))', () => {
            // This is the real-world re-order case — new explicit metric values
            const product = {
                heightData: [{ name: 'height (cm)', value: '170' }],
                weightData: [{ name: 'weight (kg)', value: '77' }],
                bmiData: [],
            };
            // getHeightDisplay returns '170 cm', getWeightDisplay returns '77 kg'
            // parseHeightToCm('170 cm') = 170, parseWeightToKg('77 kg') = 77
            // 77 / 1.70² = 26.64
            expect(getBmiDisplay(product)).toBe('26.64');
        });

        it('prefers stored bmi over calculated when both are available', () => {
            const product = {
                bmiData: [{ name: 'bmi', value: '26.64' }],
                heightData: [{ name: 'height (cm)', value: '170' }],
                weightData: [{ name: 'weight (kg)', value: '77' }],
            };
            expect(getBmiDisplay(product)).toBe('26.64');
        });

        it('calculates from separate ft/in and st (old original consultation format)', () => {
            // 5ft 7in = 170.18cm, 14st = 88.9041kg → BMI ≈ 30.70
            const product = {
                heightData: [{ name: 'ft', value: '5' }, { name: 'in', value: '7' }],
                weightData: [{ name: 'st', value: '14' }],
            };
            expect(getBmiDisplay(product)).toBe('30.70');
        });

        it('calculates from imperial pre-formatted strings', () => {
            const product = {
                heightData: [{ name: 'Height', value: '5 FT 10 IN' }],
                weightData: [{ name: 'Weight', value: '16 ST' }],
            };
            // 177.8cm, 101.60kg → 32.14
            expect(getBmiDisplay(product)).toBe('32.14');
        });

        it('calculates correctly with stone and pounds', () => {
            const product = {
                heightData: [{ name: 'cm', value: '180' }],
                weightData: [{ name: 'Weight', value: '12 ST 7 LB' }],
            };
            // 79.38kg / 3.24 = 24.50
            expect(getBmiDisplay(product)).toBe('24.50');
        });

        it('returns "-" when no data', () => {
            expect(getBmiDisplay({})).toBe('-');
        });
    });

    // ─── Previous measurements ───────────────────────────────────────────────────

    describe('getPrevHeightDisplay', () => {
        it('returns prev height value when present', () => {
            const product = { prevHeightData: [{ name: 'prev height (cm)', value: '170' }] };
            expect(getPrevHeightDisplay(product)).toBe('170');
        });

        it('returns "-" when prevHeightData is absent (old orders)', () => {
            expect(getPrevHeightDisplay({})).toBe('-');
            expect(getPrevHeightDisplay({ prevHeightData: [] })).toBe('-');
        });
    });

    describe('getPrevWeightDisplay', () => {
        it('returns prev weight value when present', () => {
            const product = { prevWeightData: [{ name: 'prev weight (kg)', value: '77' }] };
            expect(getPrevWeightDisplay(product)).toBe('77');
        });

        it('returns "-" when prevWeightData is absent (old orders)', () => {
            expect(getPrevWeightDisplay({})).toBe('-');
        });
    });

    describe('getPrevBmiDisplay', () => {
        it('returns prev bmi formatted to 2dp', () => {
            const product = { prevBmiData: [{ name: 'prev bmi', value: '26.64' }] };
            expect(getPrevBmiDisplay(product)).toBe('26.64');
        });

        it('calculates from prevHeightData + prevWeightData when prevBmiData absent', () => {
            const product = {
                prevHeightData: [{ name: 'prev height (cm)', value: '170' }],
                prevWeightData: [{ name: 'prev weight (kg)', value: '77' }],
            };
            // 77 / (1.70^2) = 26.64
            expect(getPrevBmiDisplay(product)).toBe('26.64');
        });

        it('returns "-" when prevBmiData is absent (old orders)', () => {
            expect(getPrevBmiDisplay({})).toBe('-');
        });
    });

    describe('hasPrevMeasurements', () => {
        it('returns true when any prev array has entries', () => {
            expect(hasPrevMeasurements({ prevBmiData: [{ name: 'prev bmi', value: '26.64' }] })).toBe(true);
            expect(hasPrevMeasurements({ prevHeightData: [{ name: 'prev height (cm)', value: '170' }] })).toBe(true);
        });

        it('returns false for old orders with no prev arrays', () => {
            expect(hasPrevMeasurements({})).toBe(false);
            expect(hasPrevMeasurements({ prevBmiData: [], prevHeightData: [], prevWeightData: [] })).toBe(false);
        });
    });
});


describe('Measurement Utilities', () => {
    describe('getHeightDisplay', () => {
        it('should return value from heightData if present', () => {
            const product = {
                heightData: [{ name: 'cm', value: 180 }]
            };
            expect(getHeightDisplay(product)).toBe('180 cm');
        });

        it('should return value from consultationQuestions fallback', () => {
            const product = {
                consultationQuestions: [{ name: 'Height (cm)', value: '175' }]
            };
            expect(getHeightDisplay(product)).toBe('175');
        });

        it('should return "-" if no height data found', () => {
            expect(getHeightDisplay({})).toBe('-');
        });

        it('should reconstruct FT IN string from separate ft and in Shopify properties', () => {
            // Standard Shopify consultation format: ft and in stored as separate properties
            const product = {
                heightData: [{ name: 'ft', value: '5' }, { name: 'in', value: '7' }]
            };
            expect(getHeightDisplay(product)).toBe('5 FT 7 IN');
        });

        it('should handle heightUnit alongside separate ft/in entries', () => {
            const product = {
                heightData: [
                    { name: 'heightUnit', value: 'imperial' },
                    { name: 'ft', value: '5' },
                    { name: 'in', value: '7' },
                ]
            };
            expect(getHeightDisplay(product)).toBe('5 FT 7 IN');
        });
    });

    describe('getWeightDisplay', () => {
        it('should return value from weightData if present', () => {
            const product = {
                weightData: [{ name: 'kg', value: 85 }]
            };
            expect(getWeightDisplay(product)).toBe('85 kg');
        });

        it('should return value from consultationQuestions fallback', () => {
            const product = {
                consultationQuestions: [{ name: 'Weight (kg)', value: '80' }]
            };
            expect(getWeightDisplay(product)).toBe('80');
        });

        it('should return "-" if no weight data found', () => {
            expect(getWeightDisplay({})).toBe('-');
        });

        it('should reconstruct ST string from separate st Shopify property', () => {
            // Standard Shopify format: st stored as a separate property
            const product = {
                weightData: [{ name: 'st', value: '14' }]
            };
            expect(getWeightDisplay(product)).toBe('14 ST');
        });

        it('should reconstruct ST LB string from separate st and lb Shopify properties', () => {
            const product = {
                weightData: [{ name: 'st', value: '12' }, { name: 'lb', value: '7' }]
            };
            expect(getWeightDisplay(product)).toBe('12 ST 7 LB');
        });
    });

    describe('getBmiDisplay', () => {
        it('should return value from bmiData if present', () => {
            const product = {
                bmiData: [{ name: 'BMI', value: 25.4 }]
            };
            expect(getBmiDisplay(product)).toBe('25.40');
        });

        it('should calculate BMI from height and weight if bmiData is missing', () => {
            const product = {
                heightData: [{ name: 'cm', value: 180 }],
                weightData: [{ name: 'kg', value: 81 }]
            };
            // 81 / (1.8 * 1.8) = 81 / 3.24 = 25
            expect(getBmiDisplay(product)).toBe('25.00');
        });

        it('should calculate BMI correctly from imperial units (FT, IN, ST)', () => {
            const product = {
                heightData: [{ name: 'Height', value: '5 FT 10 IN' }],
                weightData: [{ name: 'Weight', value: '16 ST' }]
            };
            // 5'10" = 177.8cm = 1.778m
            // 16 ST = 101.60464 kg
            // BMI = 101.60464 / (1.778 * 1.778) = 101.60464 / 3.161284 = 32.14
            expect(getBmiDisplay(product)).toBe('32.14');
        });

        it('should handle stone and pounds correctly', () => {
             const product = {
                heightData: [{ name: 'cm', value: '180' }],
                weightData: [{ name: 'Weight', value: '12 ST 7 LB' }]
            };
            // 12 ST 7 LB = (12 * 6.35029) + (7 * 0.453592) = 76.20348 + 3.175144 = 79.378624 kg
            // BMI = 79.378624 / (1.8 * 1.8) = 79.378624 / 3.24 = 24.50
            expect(getBmiDisplay(product)).toBe('24.50');
        });

        it('should calculate correctly when height/weight stored as separate Shopify properties (5ft 7in, 14st)', () => {
            // This is the exact real-world case where re-orders have no stored bmi property
            // and must calculate from separate ft/in/st properties.
            // Before the fix, getHeightDisplay returned "7" (just the in value) and
            // getWeightDisplay returned "14" (just the st number), giving a wrong BMI.
            const product = {
                heightData: [{ name: 'ft', value: '5' }, { name: 'in', value: '7' }],
                weightData: [{ name: 'st', value: '14' }],
            };
            // 5ft 7in = 170.18cm, 14st = 88.9041kg → BMI = 88.9041 / 1.7018² = 30.70
            expect(getBmiDisplay(product)).toBe('30.70');
        });

        it('should return "-" if calculation is not possible', () => {
            expect(getBmiDisplay({})).toBe('-');
        });
    });
});
