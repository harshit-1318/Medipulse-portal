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

describe('ContactCard — current order info', () => {
    it('renders "Order Details" heading and formatted order date', () => {
        render(<ContactCard orderInfo={baseOrderInfo} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" />);
        expect(screen.getByText('Order Details')).toBeInTheDocument();
        expect(screen.getByText('01 May 2026')).toBeInTheDocument();
    });

    it('renders current order ID with # prefix whether prefixed or raw', () => {
        const { rerender } = render(<ContactCard orderInfo={baseOrderInfo} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" />);
        expect(screen.getByText('#100500')).toBeInTheDocument();

        rerender(<ContactCard orderInfo={{ ...baseOrderInfo, orderId: '100500' }} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" />);
        expect(screen.getByText('#100500')).toBeInTheDocument();
    });

    it('renders DOB row conditionally when dob is provided or absent', () => {
        const { rerender } = render(<ContactCard orderInfo={baseOrderInfo} customerInfo={{ ...baseCustomerInfo, dob: '1990-06-15' }} formattedCreatedAt="01 May 2026" />);
        expect(screen.getByText('Date Of Birth')).toBeInTheDocument();
        expect(screen.getByText('15 Jun 1990')).toBeInTheDocument();

        rerender(<ContactCard orderInfo={baseOrderInfo} customerInfo={baseCustomerInfo} formattedCreatedAt="01 May 2026" />);
        expect(screen.queryByText('Date Of Birth')).not.toBeInTheDocument();
    });
});
