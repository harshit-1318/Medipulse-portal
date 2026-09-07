import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionButton } from '../../components';

describe('ActionButton', () => {
    it('renders icon, label and triggers onClick', () => {
        const handleClick = vi.fn();
        render(
            <ActionButton
                icon="📹"
                label="Video Consultation"
                buttonLabel="Start Call"
                onClick={handleClick}
                disabled={false}
            />
        );

        expect(screen.getByText('📹')).toBeInTheDocument();
        expect(screen.getByText('Video Consultation')).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: /Start Call/i });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();

        fireEvent.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when disabled prop is true', () => {
        const handleClick = vi.fn();
        render(
            <ActionButton
                icon="✉️"
                label="Send Email"
                onClick={handleClick}
                disabled={true}
                isCancelled={true}
            />
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeDisabled();
        expect(btn).toHaveAttribute('title', 'Actions are disabled because this order is cancelled.');
        fireEvent.click(btn);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders different icon types based on button label', () => {
        const { rerender } = render(
            <ActionButton icon="⏰" label="6-Month Review" buttonLabel="Review" onClick={vi.fn()} disabled={false} />
        );
        expect(screen.getByText('Review')).toBeInTheDocument();

        rerender(
            <ActionButton icon="📄" label="Document Request" buttonLabel="Send Document" onClick={vi.fn()} disabled={false} />
        );
        expect(screen.getByText('Send Document')).toBeInTheDocument();
    });
});
