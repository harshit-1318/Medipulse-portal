import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CustomerCard } from '../../sections/InfoCards/components/CustomerCard';

// Single-word address (no comma) so cleanAddress returns it unchanged
const baseCustomerInfo = {
    id: 7,
    name: 'Jane Doe',
    email: 'jane@example.com',
    address: 'London',
    defaultAddress: null,
    totalOrders: 8,
    dob: null,
};

describe('CustomerCard', () => {
    it('renders customer name, email, and address', () => {
        render(<CustomerCard customerInfo={baseCustomerInfo} />);
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('renders the "Customer" card heading', () => {
        render(<CustomerCard customerInfo={baseCustomerInfo} />);
        expect(screen.getByText('Customer')).toBeInTheDocument();
    });

    it('renders "Name", "Email", and "Address" labels', () => {
        render(<CustomerCard customerInfo={baseCustomerInfo} />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Address')).toBeInTheDocument();
    });

    it('does not render a last order section (moved to ContactCard)', () => {
        render(<CustomerCard customerInfo={baseCustomerInfo} />);
        // The old section header text
        expect(screen.queryByText('Last order')).not.toBeInTheDocument();
        // The new section header text (should not be here either)
        expect(screen.queryByText('Last Previous Order')).not.toBeInTheDocument();
    });

    it('does not render a "Previous Orders" navigation button', () => {
        render(<CustomerCard customerInfo={baseCustomerInfo} />);
        expect(
            screen.queryByRole('link', { name: /previous orders/i }),
        ).not.toBeInTheDocument();
    });

    it('renders a hyphen address placeholder when address is empty', () => {
        render(
            <CustomerCard
                customerInfo={{ ...baseCustomerInfo, address: '' }}
            />,
        );
        expect(screen.getByText('-')).toBeInTheDocument();
    });
});
