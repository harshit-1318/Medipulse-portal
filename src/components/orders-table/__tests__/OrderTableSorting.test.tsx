import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderTable from '../table/components/OrderTable';
import type { OrderType } from '@/api/services/orders';

// Mock scroll preservation and pagination
vi.mock('@/hooks', () => ({
    useScrollPreservation: () => ({ current: null }),
    useUrlSync: vi.fn(),
}));

const sampleOrders: OrderType[] = [
    {
        id: '#105',
        shopify_order_id: '105',
        date: '2024-03-01T12:00:00Z',
        status: 'unfulfilled',
        fulfillment_status: 'unfulfilled',
        customer: { first_name: 'Zack', last_name: 'Archer', email: 'zack@example.com', id: 1 },
        repeatedOrders: 2,
        products: [{ name: 'Product C', quantity: 3 }],
        documents: null,
        isUrgent: false,
        isParked: false,
        tags: [],
        updatedAt: '',
    },
    {
        id: '#20',
        shopify_order_id: '20',
        date: '2024-01-10T12:00:00Z',
        status: 'completed',
        fulfillment_status: 'completed',
        customer: { first_name: 'Amy', last_name: 'Adams', email: 'amy@example.com', id: 2 },
        repeatedOrders: 0,
        products: [{ name: 'Product A', quantity: 1 }],
        documents: null,
        isUrgent: false,
        isParked: false,
        tags: [],
        updatedAt: '',
    },
    {
        id: '#50',
        shopify_order_id: '50',
        date: '2024-05-20T12:00:00Z',
        status: 'on_hold',
        fulfillment_status: 'on_hold',
        customer: { first_name: 'Brian', last_name: 'Cox', email: 'brian@example.com', id: 3 },
        repeatedOrders: 5,
        products: [{ name: 'Product B', quantity: 10 }],
        documents: null,
        isUrgent: false,
        isParked: false,
        tags: [],
        updatedAt: '',
    },
];

describe('OrderTable client-side sorting', () => {
    it('sorts Order ID numerically on first click, descending on second, and resets to original order on third', () => {
        const dummySetFilters = vi.fn();
        const dummySetPage = vi.fn();

        render(
            <OrderTable
                orders={sampleOrders}
                title="Orders"
                subtitle="All Orders"
                loading={false}
                page={1}
                setPage={dummySetPage}
                total={3}
                filters={{}}
                setFilters={dummySetFilters}
                pageType="all"
            />
        );

        // Helper to get all rendered order IDs in table body order
        const getRenderedOrderIds = () => {
            const cells = screen.getAllByText(/#\d+/);
            return cells.map((el) => el.textContent?.trim());
        };

        // Initial default order: #105, #20, #50
        expect(getRenderedOrderIds()).toEqual(['#105', '#20', '#50']);

        const orderIdBtn = screen.getByText('ORDER ID').closest('button')!;

        // 1st click -> ASCENDING: #20 (20) < #50 (50) < #105 (105)
        fireEvent.click(orderIdBtn);
        expect(getRenderedOrderIds()).toEqual(['#20', '#50', '#105']);

        // 2nd click -> DESCENDING: #105 > #50 > #20
        fireEvent.click(orderIdBtn);
        expect(getRenderedOrderIds()).toEqual(['#105', '#50', '#20']);

        // 3rd click -> RESET / NO SORT: original order restored
        fireEvent.click(orderIdBtn);
        expect(getRenderedOrderIds()).toEqual(['#105', '#20', '#50']);
    });

    it('sorts customer alphabetically and resets', () => {
        const dummySetFilters = vi.fn();
        const dummySetPage = vi.fn();

        render(
            <OrderTable
                orders={sampleOrders}
                title="Orders"
                loading={false}
                page={1}
                setPage={dummySetPage}
                total={3}
                filters={{}}
                setFilters={dummySetFilters}
                pageType="all"
            />
        );

        const getRenderedCustomerNames = () => {
            return ['Amy Adams', 'Brian Cox', 'Zack Archer'].filter((name) => screen.queryByText(name)).sort((a, b) => {
                const elA = screen.getByText(a);
                const elB = screen.getByText(b);
                return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });
        };

        const customerBtn = screen.getByText('CUSTOMER').closest('button')!;

        // 1st click -> ASCENDING: Amy Adams, Brian Cox, Zack Archer
        fireEvent.click(customerBtn);
        expect(getRenderedCustomerNames()).toEqual(['Amy Adams', 'Brian Cox', 'Zack Archer']);

        // 2nd click -> DESCENDING: Zack Archer, Brian Cox, Amy Adams
        fireEvent.click(customerBtn);
        expect(getRenderedCustomerNames()).toEqual(['Zack Archer', 'Brian Cox', 'Amy Adams']);

        // 3rd click -> RESET: original order: Zack Archer, Amy Adams, Brian Cox
        fireEvent.click(customerBtn);
        expect(getRenderedCustomerNames()).toEqual(['Zack Archer', 'Amy Adams', 'Brian Cox']);
    });
});
