import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocumentRow } from '../../components/DocumentRow';

describe('DocumentRow', () => {
    it('renders label and View button when document is available', () => {
        const handleView = vi.fn();
        render(
            <DocumentRow
                label="Photo ID"
                available="https://example.com/id.jpg"
                onView={handleView}
            />
        );

        expect(screen.getByText('Photo ID')).toBeInTheDocument();
        const viewBtn = screen.getByRole('button', { name: /View/i });
        expect(viewBtn).toBeInTheDocument();

        fireEvent.click(viewBtn);
        expect(handleView).toHaveBeenCalledTimes(1);
    });

    it('renders fallback badge when document is not available', () => {
        render(
            <DocumentRow
                label="Full Body Photo"
                available={null}
                onView={vi.fn()}
                fallbackText="Missing File"
            />
        );

        expect(screen.getByText('Full Body Photo')).toBeInTheDocument();
        expect(screen.getByText('Missing File')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /View/i })).not.toBeInTheDocument();
    });

    it('renders disabled pending button when pendingText is provided', () => {
        render(
            <DocumentRow
                label="Consultation Recording"
                available={null}
                onView={vi.fn()}
                pendingText="Awaiting customer upload"
            />
        );

        const pendingBtn = screen.getByRole('button', { name: /Pending/i });
        expect(pendingBtn).toBeDisabled();
        expect(pendingBtn).toHaveAttribute('title', 'Awaiting customer upload');
    });
});
