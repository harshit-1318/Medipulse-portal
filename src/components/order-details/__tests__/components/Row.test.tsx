import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Row } from '../../components';

describe('Row', () => {
    it('renders label and string value', () => {
        render(<Row label="Email Address" value="customer@example.com" />);

        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('customer@example.com')).toBeInTheDocument();
    });

    it('renders custom ReactNode value and icon', () => {
        render(
            <Row
                label="Status"
                value={<span data-testid="custom-status">Active</span>}
                icon={<span data-testid="row-icon">★</span>}
                multiline={true}
            />
        );

        expect(screen.getByTestId('custom-status')).toHaveTextContent('Active');
        expect(screen.getByTestId('row-icon')).toHaveTextContent('★');
    });
});
