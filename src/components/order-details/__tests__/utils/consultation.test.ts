import { describe, it, expect } from 'vitest';
import { extractConsultationData } from '../../utils/consultation';

describe('Consultation Utilities', () => {
    describe('extractConsultationData', () => {
        it('should extract data from consultationQuestions', () => {
            const product = {
                consultationQuestions: [
                    { name: 'Height (cm)', value: '180' },
                    { name: 'Weight (kg)', value: '85' },
                    { name: 'BMI', value: '26.2' },
                    { name: 'Consultation Type', value: 'Weight Loss' },
                    { name: 'Medical Condition', value: 'None' }
                ]
            };
            const result = extractConsultationData(product);
            expect(result.height).toBe('180');
            expect(result.weight).toBe('85');
            expect(result.bmi).toBe('26.2');
            expect(result.consultationType).toBe('Weight Loss');
            expect(result.questions['Medical Condition']).toBe('None');
        });

        it('should fallback to lineItemsRaw.properties if consultationQuestions is empty', () => {
            const product = {
                consultationQuestions: [],
                lineItemsRaw: [
                    {
                        properties: [
                            { name: 'Height', value: '175' },
                            { name: 'Weight', value: '70' },
                            { name: 'BMI', value: '22.9' },
                            { name: 'Consultation', value: 'ED' },
                            { name: 'Allergies', value: ['Peanuts', 'Penicillin'] }
                        ]
                    }
                ]
            };
            const result = extractConsultationData(product);
            expect(result.height).toBe('175');
            expect(result.weight).toBe('70');
            expect(result.bmi).toBe('22.9');
            expect(result.consultationType).toBe('ED');
            expect(result.questions['Allergies']).toBe('Peanuts, Penicillin');
        });

        it('should normalize keys correctly', () => {
            const product = {
                lineItemsRaw: [
                    {
                        properties: [
                            { name: 'height (cm)', value: '170' },
                            { name: 'weight (kg)', value: '65' },
                            { name: 'body mass index', value: '22.5' }
                        ]
                    }
                ]
            };
            const result = extractConsultationData(product);
            expect(result.height).toBe('170');
            expect(result.weight).toBe('65');
            expect(result.bmi).toBe('22.5');
        });

        it('should handle missing data gracefully', () => {
            const result = extractConsultationData({});
            expect(result.height).toBe('');
            expect(result.weight).toBe('');
            expect(result.bmi).toBe('');
            expect(result.questions).toEqual({});
        });

        it('should merge data from multiple line items if necessary', () => {
             const product = {
                lineItemsRaw: [
                    {
                        properties: [
                            { name: 'Height', value: '170' }
                        ]
                    },
                    {
                        properties: [
                            { name: 'Weight', value: '65' }
                        ]
                    }
                ]
            };
            const result = extractConsultationData(product);
            expect(result.height).toBe('170');
            expect(result.weight).toBe('65');
        });
    });
});
