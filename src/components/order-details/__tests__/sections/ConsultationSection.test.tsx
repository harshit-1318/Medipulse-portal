import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsultationSection } from '../../sections/Consultation';
import type { Product } from '../../types';

function createProduct(overrides: Partial<Product> = {}): Product {
    return {
        name: 'Generic Product',
        quantity: 1,
        price: '0',
        product_id: 1,
        categories: [],
        hasValidData: false,
        heightData: [],
        weightData: [],
        bmiData: [],
        consultationQuestions: [],
        lineItemsRaw: [],
        ...overrides,
    };
}

describe('ConsultationSection', () => {
    it('renders tabs only for clinical products in mixed orders', () => {
        const products: Product[] = [
            createProduct({
                name: 'Mounjaro Injectable Pen - Step up dose 5mg',
                product_id: 101,
                categories: ['weight loss'],
            }),
            createProduct({
                name: 'Valupak Vitamin D3 1000IU (25mcg) - 60 Capsules',
                product_id: 202,
                categories: ['vitamins'],
            }),
            createProduct({
                name: 'Valupak Multivitamin',
                product_id: 303,
                categories: ['supplements'],
            }),
            createProduct({
                name: 'x100 Needles',
                product_id: 404,
                categories: ['accessories'],
            }),
        ];

        render(<ConsultationSection products={products} />);

        expect(screen.getByRole('button', { name: /mounjaro injectable pen/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /valupak vitamin d3/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /valupak multivitamin/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /x100 needles/i })).not.toBeInTheDocument();
    });

    it('shows no tabs and keeps empty consultation state when there are no clinical products', () => {
        const products: Product[] = [
            createProduct({
                name: 'Valupak Multivitamin',
                product_id: 1,
                categories: ['supplements'],
            }),
            createProduct({
                name: 'x100 Needles',
                product_id: 2,
                categories: ['accessories'],
            }),
        ];

        render(<ConsultationSection products={products} />);

        expect(screen.queryAllByRole('button')).toHaveLength(0);
        expect(screen.getByText('No consultation data found.')).toBeInTheDocument();
    });

    it('keeps Mounjaro first among filtered clinical tabs', () => {
        const products: Product[] = [
            createProduct({
                name: 'Wegovy 1mg',
                product_id: 11,
                categories: ['weight loss'],
            }),
            createProduct({
                name: 'Mounjaro Injectable Pen - Step up dose 5mg',
                product_id: 12,
                categories: ['weight loss'],
            }),
            createProduct({
                name: 'Valupak Multivitamin',
                product_id: 13,
                categories: ['supplements'],
            }),
        ];

        render(<ConsultationSection products={products} />);

        const tabButtons = screen.getAllByRole('button');
        expect(tabButtons[0]).toHaveTextContent(/mounjaro/i);
        expect(tabButtons[1]).toHaveTextContent(/wegovy/i);
    });

    it('supports tab switching when clinical products do not have product_id values', () => {
        const products: Product[] = [
            createProduct({
                name: 'Mounjaro Injectable Pen - Step up dose 5mg',
                product_id: undefined as unknown as number,
                categories: ['weight loss'],
                consultationQuestions: [{ name: 'Question A', value: 'Answer A' }],
            }),
            createProduct({
                name: 'Wegovy 1mg',
                product_id: undefined as unknown as number,
                categories: ['weight loss'],
                consultationQuestions: [{ name: 'Question B', value: 'Answer B' }],
            }),
        ];

        render(<ConsultationSection products={products} />);

        expect(screen.getByText('Answer A')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /wegovy/i }));

        expect(screen.getByText('Answer B')).toBeInTheDocument();
    });
});
