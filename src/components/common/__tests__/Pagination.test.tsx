import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../Pagination';

describe('Pagination Component', () => {
    it('renders current page and derived total pages from items count', () => {
        render(
            <Pagination
                currentPage={1}
                totalItems={50}
                itemsPerPage={10}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    });

    it('handles next and previous page changes correctly', () => {
        const handlePageChange = vi.fn();
        render(
            <Pagination
                currentPage={2}
                totalPages={5}
                onPageChange={handlePageChange}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        expect(handlePageChange).toHaveBeenCalledWith(3);

        fireEvent.click(screen.getByRole('button', { name: /previous/i }));
        expect(handlePageChange).toHaveBeenCalledWith(1);
    });

    it('disables next button on the last page', () => {
        render(
            <Pagination
                currentPage={5}
                totalPages={5}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled();
    });
});
