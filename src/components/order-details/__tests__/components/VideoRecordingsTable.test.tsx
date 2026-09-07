import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoRecordingsTable } from '../../components';

describe('VideoRecordingsTable', () => {
    it('renders loading state when loading is true', () => {
        render(<VideoRecordingsTable recordings={[]} loading={true} orderId="ORD-101" />);
        expect(screen.getByText(/Fetching recordings/i)).toBeInTheDocument();
    });

    it('renders empty state when recordings array is empty', () => {
        render(<VideoRecordingsTable recordings={[]} loading={false} orderId="ORD-101" />);
        expect(screen.getByText(/No recordings available/i)).toBeInTheDocument();
    });

    it('renders recordings and opens video player on button click', () => {
        const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        const mockRecordings = [
            {
                url: 'https://example.com/recording1.mp4',
                recordedAt: '2024-03-01T10:00:00Z',
                duration: 45,
            },
        ];

        render(
            <VideoRecordingsTable
                recordings={mockRecordings}
                loading={false}
                orderId="ORD-101"
                shopifyId="12345"
            />
        );

        expect(screen.getByText(/45 sec/i)).toBeInTheDocument();
        const playBtn = screen.getByRole('button', { name: /Play Recording/i });
        expect(playBtn).toBeInTheDocument();

        fireEvent.click(playBtn);
        expect(windowSpy).toHaveBeenCalledWith(
            '/orders/12345/video-player?url=https%3A%2F%2Fexample.com%2Frecording1.mp4',
            '_blank'
        );

        windowSpy.mockRestore();
    });
});
