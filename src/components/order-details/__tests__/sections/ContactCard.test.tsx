import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactCard } from '../../sections/InfoCards/components/ContactCard';

// Mock the API call made when the Order ID button is clicked
vi.mock('@/api/services/orders/fetchers/core', () => ({
    lookupOrderByDisplayId: vi.fn().mockResolvedValue(null),
}));

// Minimal orderInfo fixture for the currently-viewed order
const baseOrderInfo = {
    orderId: '#100500',
    shopifyOrderId: 100500,
    createdAt: '2026-05-01T10:00:00Z',
    status: 'unfulfilled',
    fulfillmentStatus: 'unfulfilled',
};

// Minimal customerInfo fixture
const baseCustomerInfo = {
    id: 42,
    name: 'John Smith',
    email: 'john@example.com',
    // Single word — no comma → cleanAddress returns it as-is
    address: 'London',
    defaultAddress: null,
    totalOrders: 12,
    dob: null,
};

// Shared lastPreviousOrder fixture (on_hold — no date row expected)
const onHoldLastOrder = {
    orderId: '#114406',
    orderStatus: 'on_hold',
    fulfillmentStatus: 'on_hold',
    createdAt: '2026-06-04T06:22:04.000Z',
    dispatchedAt: null,
    cancelledAt: null,
    products: [
        { name: 'Shipment Protection' },
        { name: 'Wegovy® Injectable 2 Pack Bundle' },
    ],
};

// ─── Current order info ──────────────────────────────────────────────────────

describe('ContactCard — current order info', () => {
    it('renders "Order Details" heading', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.getByText('Order Details')).toBeInTheDocument();
    });

    it('renders current order ID with # prefix', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.getByText('#100500')).toBeInTheDocument();
    });

    it('prefixes order ID with # when the backend value lacks it', () => {
        render(
            <ContactCard
                orderInfo={{ ...baseOrderInfo, orderId: '100500' }}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.getByText('#100500')).toBeInTheDocument();
    });

    it('renders formatted order date', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.getByText('01 May 2026')).toBeInTheDocument();
    });

    it('renders DOB row when dob is provided', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={{ ...baseCustomerInfo, dob: '1990-06-15' }}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.getByText('Date Of Birth')).toBeInTheDocument();
        // formatDateModern('1990-06-15') → "15 Jun 1990"
        expect(screen.getByText('15 Jun 1990')).toBeInTheDocument();
    });

    it('does not render DOB row when dob is absent', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.queryByText('Date Of Birth')).not.toBeInTheDocument();
    });
});

// ─── Last Previous Order — visibility ────────────────────────────────────────

describe('ContactCard — last previous order visibility', () => {
    it('does not render "Last Previous Order" section when lastPreviousOrder is null', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={null}
            />,
        );
        expect(screen.queryByText('Last Order')).not.toBeInTheDocument();
    });

    it('does not render "Last Previous Order" section when lastPreviousOrder is undefined', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
            />,
        );
        expect(screen.queryByText('Last Order')).not.toBeInTheDocument();
    });

    it('renders "Last Previous Order" section when data is provided', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={onHoldLastOrder}
            />,
        );
        expect(screen.getByText('Last Order')).toBeInTheDocument();
    });
});

// ─── Last Previous Order — clickable link ────────────────────────────────────

describe('ContactCard — last previous order link', () => {
    it('renders orderId as a clickable button', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={onHoldLastOrder}
            />,
        );
        const btn = screen.getByRole('button', { name: '#114406' });
        expect(btn).toBeInTheDocument();
    });

    it('does not render the order ID button when orderId is absent', () => {
        const noIdOrder = { ...onHoldLastOrder, orderId: undefined };
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={noIdOrder}
            />,
        );
        expect(screen.queryByRole('button', { name: /^#/ })).not.toBeInTheDocument();
    });
});

// ─── Last Previous Order — conditional date rows ─────────────────────────────

describe('ContactCard — last previous order conditional dates', () => {
    it('shows "Fulfilled Date" when orderStatus is "fulfilled" and dispatchedAt is set', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={{
                    orderId: '#114407',
                    orderStatus: 'fulfilled',
                    fulfillmentStatus: 'fulfilled',
                    createdAt: '2026-05-01T00:00:00.000Z',
                    dispatchedAt: '2026-05-15T00:00:00.000Z',
                    cancelledAt: null,
                    products: [],
                }}
            />,
        );
        expect(screen.getByText('Fulfilled Date')).toBeInTheDocument();
        // formatDate('2026-05-15T00:00:00.000Z') → "15-05-2026"
        expect(screen.getByText('15-05-2026')).toBeInTheDocument();
    });

    it('does not show "Fulfilled Date" when orderStatus is "fulfilled" but dispatchedAt is null', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={{
                    orderId: '#114407',
                    orderStatus: 'fulfilled',
                    createdAt: '2026-05-01T00:00:00.000Z',
                    dispatchedAt: null,
                    cancelledAt: null,
                    products: [],
                }}
            />,
        );
        expect(screen.queryByText('Fulfilled Date')).not.toBeInTheDocument();
    });

    it('shows "Cancelled Date" when orderStatus is "cancelled" and cancelledAt is set', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={{
                    orderId: '#114408',
                    orderStatus: 'cancelled',
                    fulfillmentStatus: 'cancelled',
                    createdAt: '2026-04-01T00:00:00.000Z',
                    dispatchedAt: null,
                    cancelledAt: '2026-04-03T00:00:00.000Z',
                    products: [],
                }}
            />,
        );
        expect(screen.getByText('Cancelled Date')).toBeInTheDocument();
        // formatDate('2026-04-03T00:00:00.000Z') → "03-04-2026"
        expect(screen.getByText('03-04-2026')).toBeInTheDocument();
    });

    it('does not show "Cancelled Date" when orderStatus is "cancelled" but cancelledAt is null', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={{
                    orderId: '#114408',
                    orderStatus: 'cancelled',
                    createdAt: '2026-04-01T00:00:00.000Z',
                    dispatchedAt: null,
                    cancelledAt: null,
                    products: [],
                }}
            />,
        );
        expect(screen.queryByText('Cancelled Date')).not.toBeInTheDocument();
    });

    it('shows neither "Fulfilled Date" nor "Cancelled Date" when orderStatus is "on_hold"', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={onHoldLastOrder}
            />,
        );
        expect(screen.queryByText('Fulfilled Date')).not.toBeInTheDocument();
        expect(screen.queryByText('Cancelled Date')).not.toBeInTheDocument();
    });

    it('shows neither date row when orderStatus is "unfulfilled"', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={{
                    orderId: '#114409',
                    orderStatus: 'unfulfilled',
                    createdAt: '2026-05-01T00:00:00.000Z',
                    dispatchedAt: null,
                    cancelledAt: null,
                    products: [],
                }}
            />,
        );
        expect(screen.queryByText('Fulfilled Date')).not.toBeInTheDocument();
        expect(screen.queryByText('Cancelled Date')).not.toBeInTheDocument();
    });
});

// ─── Last Previous Order — products and button ───────────────────────────────

describe('ContactCard — last previous order products and navigation', () => {
    it('renders non-shipment products and excludes products with "shipment" in the name', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={onHoldLastOrder}
            />,
        );
        expect(screen.queryByText('Shipment Protection')).not.toBeInTheDocument();
        expect(screen.getByText('Wegovy® Injectable 2 Pack Bundle')).toBeInTheDocument();
    });

    it('renders nothing for products section when all products are shipment items', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={baseCustomerInfo}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={{
                    ...onHoldLastOrder,
                    products: [{ name: 'Shipment Protection' }],
                }}
            />,
        );
        expect(screen.queryByText('Products')).not.toBeInTheDocument();
    });

    it('renders "Previous Orders" button with totalOrders count and correct href', () => {
        render(
            <ContactCard
                orderInfo={baseOrderInfo}
                customerInfo={{ ...baseCustomerInfo, totalOrders: 12, id: 42 }}
                formattedCreatedAt="01 May 2026"
                lastPreviousOrder={onHoldLastOrder}
            />,
        );
        // The count is in a sibling span — check its value appears in the document
        expect(screen.getByText('12')).toBeInTheDocument();
        // The anchor wraps both the count and "Previous Orders" text
        const link = screen.getByRole('link', { name: /previous orders/i });
        expect(link).toHaveAttribute(
            'href',
            '/orders/all?customerId=42&sortBy=createdAt&sort=desc',
        );
    });
});
