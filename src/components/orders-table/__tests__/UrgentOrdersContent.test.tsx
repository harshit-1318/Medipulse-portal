import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UrgentOrdersContent } from "../views";
import { useUrgentOrdersData } from "../hooks";

// Mock dependencies
vi.mock('@/components/orders-table/hooks', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        useUrgentOrdersData: vi.fn(),
    };
});

vi.mock('@/components/orders-table/table', () => ({
    default: ({ title, orders, loading }: any) => (
        <div data-testid="mock-order-table">
            <h2>{title}</h2>
            <div data-testid="orders-count">{orders.length}</div>
            {loading && <div data-testid="loading-indicator">Loading...</div>}
        </div>
    ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    LazyMotion: ({ children }: any) => <div>{children}</div>,
    domAnimation: {},
}));

describe('UrgentOrdersContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the header and the order table', () => {
        vi.mocked(useUrgentOrdersData).mockReturnValue({
            orders: [],
            page: 1,
            setPage: vi.fn(),
            total: 0,
            loading: false,
            filters: {},
            setFilters: vi.fn(),
            filtersEnabled: false,
            setFiltersEnabled: vi.fn(),
        } as any);

        render(<UrgentOrdersContent />);

        expect(screen.getByText('Urgent Orders')).toBeInTheDocument();
        expect(screen.getByTestId('mock-order-table')).toBeInTheDocument();
        expect(screen.getByText('Urgent Orders List')).toBeInTheDocument();
    });

    it('passes data from the hook to the table', () => {
        const mockOrders = [
            { id: '1', shopifyOrderId: 101 },
            { id: '2', shopifyOrderId: 102 },
        ];

        vi.mocked(useUrgentOrdersData).mockReturnValue({
            orders: mockOrders,
            page: 1,
            setPage: vi.fn(),
            total: 2,
            loading: true,
            filters: {},
            setFilters: vi.fn(),
            filtersEnabled: false,
            setFiltersEnabled: vi.fn(),
        } as any);

        render(<UrgentOrdersContent />);

        expect(screen.getByTestId('orders-count')).toHaveTextContent('2');
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
});
