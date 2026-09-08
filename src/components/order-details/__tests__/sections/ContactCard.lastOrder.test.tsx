import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactCard } from '../../sections/InfoCards/components/ContactCard';

vi.mock('@/api/services/orders', async (importOriginal) => {
    const actual = await importOriginal<Record<string, any>>();
    return {
        ...actual,
        lookupOrderByDisplayId: vi.fn().mockResolvedValue(null),
    };
});

const baseOrderInfo = {
    orderId: '#100500',
    shopifyOrderId: 100500,
    createdAt: '2026-05-01T10:00:00Z',
    status: 'unfulfilled',
    fulfillmentStatus: 'unfulfilled',
};

const baseCustomerInfo = {
    id: 42,
    name: 'John Smith',
    email: 'john@example.com',
    address: 'London',
    defaultAddress: null,
    totalOrders: 12,
    dob: null,
};

const onHoldLastOrder = {
    orderId: '#114406',
    orderStatus: 'on_hold',
    fulfillmentStatus: 'on_hold',
    createdAt: '2026-06-04T06:22:04.000Z',
    dispatchedAt: null,
    cancelledAt: null,
    products: [{ name: 'Shipment Protection' }, { name: 'Wegovy® Injectable 2 Pack Bundle' }],
};

const renderContactCard = (lastPreviousOrder?: any) =>
    render(<ContactCard orderInfo={baseOrderInfo} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" lastPreviousOrder={lastPreviousOrder} />);

describe('ContactCard — last previous order', () => {
    it('renders or hides Last Order section based on data presence', () => {
        const { rerender } = renderContactCard(null);
        expect(screen.queryByText('Last Order')).not.toBeInTheDocument();

        rerender(<ContactCard orderInfo={baseOrderInfo} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" lastPreviousOrder={onHoldLastOrder} />);
        expect(screen.getByText('Last Order')).toBeInTheDocument();
    });

    it('renders orderId as a clickable button when provided, omits when absent', () => {
        const { rerender } = renderContactCard(onHoldLastOrder);
        expect(screen.getByRole('button', { name: '#114406' })).toBeInTheDocument();

        rerender(<ContactCard orderInfo={baseOrderInfo} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" lastPreviousOrder={{ ...onHoldLastOrder, orderId: undefined }} />);
        expect(screen.queryByRole('button', { name: /^#/ })).not.toBeInTheDocument();
    });

    it.each([
        ['fulfilled', '2026-05-15T00:00:00.000Z', null, 'Fulfilled Date', '15-05-2026'],
        ['cancelled', null, '2026-04-03T00:00:00.000Z', 'Cancelled Date', '03-04-2026'],
    ])('shows %s date when status matches and timestamp is set', (status, dispatchedAt, cancelledAt, label, formattedDate) => {
        renderContactCard({ orderId: '#114407', orderStatus: status, fulfillmentStatus: status, createdAt: '2026-05-01T00:00:00.000Z', dispatchedAt, cancelledAt, products: [] });
        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it.each([
        ['fulfilled', null, null, 'Fulfilled Date'],
        ['cancelled', null, null, 'Cancelled Date'],
        ['on_hold', null, null, 'Fulfilled Date'],
        ['unfulfilled', null, null, 'Cancelled Date'],
    ])('does not show %s label when timestamps are missing or status is pending', (status, dispatchedAt, cancelledAt, label) => {
        renderContactCard({ orderId: '#114408', orderStatus: status, createdAt: '2026-04-01T00:00:00.000Z', dispatchedAt, cancelledAt, products: [] });
        expect(screen.queryByText(label)).not.toBeInTheDocument();
    });

    it('filters out shipment products and renders clinical products', () => {
        renderContactCard(onHoldLastOrder);
        expect(screen.queryByText('Shipment Protection')).not.toBeInTheDocument();
        expect(screen.getByText('Wegovy® Injectable 2 Pack Bundle')).toBeInTheDocument();
    });

    it('omits products section when all items are shipment protections', () => {
        renderContactCard({ ...onHoldLastOrder, products: [{ name: 'Shipment Protection' }] });
        expect(screen.queryByText('Products')).not.toBeInTheDocument();
    });

    it('renders "Previous Orders" button with totalOrders count and correct href', () => {
        render(<ContactCard orderInfo={baseOrderInfo} customerInfo={{ ...baseCustomerInfo, totalOrders: 12, id: 42 }} formattedCreatedAt="01 May 2026" lastPreviousOrder={onHoldLastOrder} />);
        expect(screen.getByText('12')).toBeInTheDocument();
        const link = screen.getByRole('link', { name: /previous orders/i });
        expect(link).toHaveAttribute('href', '/orders/all?customerId=42&sortBy=createdAt&sort=desc');
    });
});
