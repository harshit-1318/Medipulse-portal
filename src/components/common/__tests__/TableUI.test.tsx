import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TableRow, Badge, ActionButton } from '../table';
import { Check } from 'lucide-react';

describe('TableUI Components', () => {
    it('renders TableRow with custom content inside a table body', () => {
        render(
            <table>
                <tbody>
                    <TableRow data-testid="test-row">
                        <td>Cell Content</td>
                    </TableRow>
                </tbody>
            </table>
        );

        expect(screen.getByTestId('test-row')).toBeInTheDocument();
        expect(screen.getByText('Cell Content')).toBeInTheDocument();
    });

    it('renders Badge with variants and icons', () => {
        render(
            <Badge variant="success" icon={Check}>
                Active
            </Badge>
        );

        const badgeText = screen.getByText('Active');
        expect(badgeText).toBeInTheDocument();
        expect(badgeText.parentElement).toHaveClass('bg-emerald-50/80');
    });

    it('renders ActionButton and handles click events', () => {
        const handleClick = vi.fn();
        render(
            <ActionButton
                icon={Check}
                label="Confirm Action"
                onClick={handleClick}
            />
        );

        const button = screen.getByRole('button', { name: /Confirm Action/i });
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables ActionButton when disabled prop is true', () => {
        render(
            <ActionButton
                icon={Check}
                label="Disabled Action"
                disabled={true}
            />
        );

        const button = screen.getByRole('button', { name: /Disabled Action/i });
        expect(button).toBeDisabled();
    });
});
