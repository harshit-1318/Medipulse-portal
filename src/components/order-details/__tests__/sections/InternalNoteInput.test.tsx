import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InternalNoteInput } from '../../sections/InternalNotes/components/InternalNoteInput';

const defaultProps = {
    onAdd: vi.fn(),
    isPending: false,
    onPark: vi.fn(),
    isParking: false,
    isParked: false,
    isCancelled: false,
};

describe('InternalNoteInput', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Park button - normal order
    it('renders enabled Park this Order button on a normal order', () => {
        render(<InternalNoteInput {...defaultProps} />);
        const btn = screen.getByRole('button', { name: /park this order/i });
        expect(btn).toBeInTheDocument();
        expect(btn).not.toBeDisabled();
    });

    it('calls onPark when Park button is clicked on a normal order', () => {
        render(<InternalNoteInput {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /park this order/i }));
        expect(defaultProps.onPark).toHaveBeenCalledTimes(1);
    });

    it('shows Parking and disables button while isParking is true', () => {
        render(<InternalNoteInput {...defaultProps} isParking={true} />);
        const btn = screen.getByRole('button', { name: /parking/i });
        expect(btn).toBeDisabled();
    });

    // Park button - cancelled order
    it('disables Park this Order button when order is cancelled', () => {
        render(<InternalNoteInput {...defaultProps} isCancelled={true} />);
        const btn = screen.getByRole('button', { name: /park this order/i });
        expect(btn).toBeDisabled();
    });

    it('shows tooltip Cannot park a cancelled order when isCancelled is true', () => {
        render(<InternalNoteInput {...defaultProps} isCancelled={true} />);
        const btn = screen.getByRole('button', { name: /park this order/i });
        expect(btn).toHaveAttribute('title', 'Cannot park a cancelled order');
    });

    it('does NOT call onPark when Park button is clicked on a cancelled order', () => {
        render(<InternalNoteInput {...defaultProps} isCancelled={true} />);
        fireEvent.click(screen.getByRole('button', { name: /park this order/i }));
        expect(defaultProps.onPark).not.toHaveBeenCalled();
    });

    it('does not show tooltip when order is not cancelled', () => {
        render(<InternalNoteInput {...defaultProps} isCancelled={false} />);
        const btn = screen.getByRole('button', { name: /park this order/i });
        expect(btn).not.toHaveAttribute('title');
    });

    // Park button - already parked
    it('shows disabled Parked Order button when isParked is true', () => {
        render(<InternalNoteInput {...defaultProps} isParked={true} />);
        const btn = screen.getByRole('button', { name: /parked order/i });
        expect(btn).toBeDisabled();
        expect(screen.queryByRole('button', { name: /park this order/i })).not.toBeInTheDocument();
    });

    // Add Note button
    it('Add Note button is disabled when textarea is empty', () => {
        render(<InternalNoteInput {...defaultProps} />);
        expect(screen.getByRole('button', { name: /add note/i })).toBeDisabled();
    });

    it('Add Note button enables after typing and calls onAdd on click', () => {
        render(<InternalNoteInput {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText(/add team note/i), { target: { value: 'Test note' } });
        const addBtn = screen.getByRole('button', { name: /add note/i });
        expect(addBtn).not.toBeDisabled();
        fireEvent.click(addBtn);
        expect(defaultProps.onAdd).toHaveBeenCalledWith('Test note');
    });
});
