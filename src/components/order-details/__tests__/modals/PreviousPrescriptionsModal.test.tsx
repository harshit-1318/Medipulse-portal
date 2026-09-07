import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PreviousPrescriptionsModal } from '../../modals/media/PreviousPrescriptionsModal';

describe('PreviousPrescriptionsModal', () => {
    it('renders prescription documents and handles close action', () => {
        const handleClose = vi.fn();
        const urls = [
            'https://example.com/files/prescription_001.pdf',
            'https://example.com/files/prescription_002.pdf'
        ];

        render(<PreviousPrescriptionsModal urls={urls} onClose={handleClose} />);

        expect(screen.getByText('Previous Prescriptions')).toBeInTheDocument();
        expect(screen.getByText('2 Documents')).toBeInTheDocument();
        expect(screen.getByText('prescription_001.pdf')).toBeInTheDocument();
        expect(screen.getByText('prescription_002.pdf')).toBeInTheDocument();

        const closeBtn = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(closeBtn);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
