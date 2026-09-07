import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import { useOrderDetailsPage } from '../hooks/useOrderDetailsPage';

vi.mock('../hooks/useOrderDetailsPage', () => ({
    useOrderDetailsPage: vi.fn(),
}));

vi.mock('@/components/common/QueryProvider', () => ({
    QueryProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../sections/Header', () => ({
    OrderHeader: ({ orderInfo }: any) => <div data-testid="order-header">{orderInfo.shopifyOrderId}</div>
}));

vi.mock('../sections/Main', () => ({
    OrderDetailsMainContent: () => <div data-testid="main-content">Main Content</div>
}));

vi.mock('../OrderDetailsModals', () => ({
    OrderDetailsModals: () => <div data-testid="modals">Modals</div>
}));

describe('OrderDetailsPage Integration', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    const mockOrderId = '12345';
    const mockOrder: any = {
        orderInfo: {
            shopifyOrderId: 12345,
            orderId: 'ORD-123',
            createdAt: '2024-03-01T10:00:00Z',
            status: 'Pending'
        }
    };

    it('renders loading state correctly', () => {
        vi.mocked(useOrderDetailsPage).mockImplementation(() => ({
            loading: true,
            order: null,
            error: null,
        } as any));

        render(<OrderDetailsPage orderId={mockOrderId} />);
        expect(screen.queryByTestId('order-header')).not.toBeInTheDocument();
    });

    it('renders order details when data is loaded', () => {
        vi.mocked(useOrderDetailsPage).mockImplementation(() => ({
            loading: false,
            order: mockOrder,
            error: null,
            isReadOnly: false,
            activeModal: null,
            showModal: vi.fn(),
            hideModal: vi.fn(),
            scrState: {},
            commActions: {},
            imageSlider: {}
        } as any));

        render(<OrderDetailsPage orderId={mockOrderId} />);
        
        expect(screen.getByTestId('order-header')).toHaveTextContent('12345');
        expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('renders error state if data fetching fails', () => {
        vi.mocked(useOrderDetailsPage).mockImplementation(() => ({
            loading: false,
            order: null,
            error: 'Failed to fetch',
        } as any));

        render(<OrderDetailsPage orderId={mockOrderId} />);
        expect(screen.getByText(/Failed to load order/i)).toBeInTheDocument();
        expect(screen.getByText(/couldn't find the order/i)).toBeInTheDocument();
    });

    it('renders session expired if error is 401', () => {
        vi.mocked(useOrderDetailsPage).mockImplementation(() => ({
            loading: false,
            order: null,
            error: { response: { status: 401 } },
        } as any));

        render(<OrderDetailsPage orderId={mockOrderId} />);
        expect(screen.getByText(/Your session has expired/i)).toBeInTheDocument();
    });
});
