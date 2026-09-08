import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsultationSection } from '../../sections/Consultation';
import type { Product } from '../../types';

const mkProd = (overrides: Partial<Product> = {}): Product => ({
    name: 'Generic', quantity: 1, price: '0', product_id: 1, categories: [],
    hasValidData: false, heightData: [], weightData: [], bmiData: [],
    consultationQuestions: [], lineItemsRaw: [], ...overrides,
});

describe('ConsultationSection', () => {
    it('renders tabs only for clinical products in mixed orders', () => {
        const products = [
            mkProd({ name: 'Mounjaro Injectable Pen', product_id: 101, categories: ['weight loss'] }),
            mkProd({ name: 'Valupak Vitamin D3', product_id: 202, categories: ['vitamins'] }),
            mkProd({ name: 'x100 Needles', product_id: 404, categories: ['accessories'] }),
        ];
        render(<ConsultationSection products={products} />);

        expect(screen.getByRole('button', { name: /mounjaro/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /valupak/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /needles/i })).not.toBeInTheDocument();
    });

    it('shows empty consultation state when no clinical products exist', () => {
        const products = [
            mkProd({ name: 'Valupak Multivitamin', categories: ['supplements'] }),
            mkProd({ name: 'x100 Needles', categories: ['accessories'] }),
        ];
        render(<ConsultationSection products={products} />);

        expect(screen.queryAllByRole('button')).toHaveLength(0);
        expect(screen.getByText('No consultation data found.')).toBeInTheDocument();
    });

    it('keeps Mounjaro first among filtered clinical tabs', () => {
        const products = [
            mkProd({ name: 'Wegovy 1mg', product_id: 11, categories: ['weight loss'] }),
            mkProd({ name: 'Mounjaro Injectable Pen', product_id: 12, categories: ['weight loss'] }),
        ];
        render(<ConsultationSection products={products} />);

        const tabButtons = screen.getAllByRole('button');
        expect(tabButtons[0]).toHaveTextContent(/mounjaro/i);
        expect(tabButtons[1]).toHaveTextContent(/wegovy/i);
    });

    it('supports tab switching when clinical products do not have product_id values', () => {
        const products = [
            mkProd({ name: 'Mounjaro Pen', product_id: undefined as any, categories: ['weight loss'], consultationQuestions: [{ name: 'QA', value: 'Ans A' }] }),
            mkProd({ name: 'Wegovy Pen', product_id: undefined as any, categories: ['weight loss'], consultationQuestions: [{ name: 'QB', value: 'Ans B' }] }),
        ];
        render(<ConsultationSection products={products} />);

        expect(screen.getByText('Ans A')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /wegovy/i }));
        expect(screen.getByText('Ans B')).toBeInTheDocument();
    });
});
