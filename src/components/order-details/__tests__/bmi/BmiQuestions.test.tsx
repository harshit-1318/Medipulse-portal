import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BmiQuestions } from '../../sections/bmi/components/BmiQuestions';

describe('BmiQuestions', () => {
    const mockProduct: any = {
        consultationQuestions: [
            { name: 'Height (cm)', value: '180' },
            { name: 'Weight (kg)', value: '80' },
            { name: 'BMI', value: '24.7' }
        ]
    };

    it('renders the questions and values correctly', () => {
        render(<BmiQuestions mainProduct={mockProduct} />);
        
        expect(screen.getByText('Height (cm)')).toBeInTheDocument();
        expect(screen.getByText('180')).toBeInTheDocument();
        
        expect(screen.getByText('Weight (kg)')).toBeInTheDocument();
        expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('renders correctly even with empty questions', () => {
        render(<BmiQuestions mainProduct={{ consultationQuestions: [] } as any} />);
        expect(screen.getByText('Patient Declared Answers')).toBeInTheDocument();
    });
});
