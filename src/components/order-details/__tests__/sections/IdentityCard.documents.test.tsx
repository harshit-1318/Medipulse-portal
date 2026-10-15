import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IdentityCard } from '../../sections/DocumentPrescription/components/IdentityCard';

vi.mock('../../sections/DocumentPrescription/components/IdentityDocumentRows', () => ({
    IdentityDocumentRows: () => null,
}));

describe('IdentityCard — Customer Documents Availability', () => {
    const defaultProps = {
        sixMonthReview: undefined,
        handleView: vi.fn(),
        handleViewPrescriptionList: vi.fn(),
        onViewVideoRecordings: vi.fn(),
        isWeightLoss: false,
        order: { orderInfo: { orderId: 'MP-95478', shopifyOrderId: '6592679402' } },
    };

    it('Scenario 1: No documents uploaded (e.g. order #MP-95478) shows Not Uploaded badges and no View buttons', () => {
        render(
            <IdentityCard
                {...defaultProps}
                customerDocuments={{
                    id_card: null,
                    full_photo: null,
                    video_recordings: [],
                } as any}
                consultationFlags={{
                    has_id_card: false,
                    has_full_photo: false,
                    has_video_recording: false,
                } as any}
            />
        );

        expect(screen.getByText("Customer's ID")).toBeInTheDocument();
        expect(screen.getByText("Customer's Full Photo")).toBeInTheDocument();
        expect(screen.getByText("Customer's Video Recording")).toBeInTheDocument();

        // All 3 document rows show "Not Uploaded"
        const notUploadedBadges = screen.getAllByText('Not Uploaded');
        expect(notUploadedBadges).toHaveLength(3);

        // No View buttons should appear
        expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument();
    });

    it('Scenario 2: Only ID document uploaded shows View button for ID, and Not Uploaded for Photo & Video', () => {
        render(
            <IdentityCard
                {...defaultProps}
                customerDocuments={{
                    id_card: 'https://example.com/id.jpg',
                    full_photo: null,
                    video_recordings: [],
                } as any}
                consultationFlags={{
                    has_id_card: true,
                    has_full_photo: false,
                    has_video_recording: false,
                } as any}
            />
        );

        const viewButtons = screen.getAllByRole('button', { name: /view/i });
        expect(viewButtons).toHaveLength(1);

        const notUploadedBadges = screen.getAllByText('Not Uploaded');
        expect(notUploadedBadges).toHaveLength(2);
    });

    it('Scenario 3: ID and photo uploaded, video missing', () => {
        render(
            <IdentityCard
                {...defaultProps}
                customerDocuments={{
                    id_card: 'https://example.com/id.jpg',
                    full_photo: 'https://example.com/photo.jpg',
                    video_recordings: [],
                } as any}
                consultationFlags={{
                    has_id_card: true,
                    has_full_photo: true,
                    has_video_recording: false,
                } as any}
            />
        );

        const viewButtons = screen.getAllByRole('button', { name: /view/i });
        expect(viewButtons).toHaveLength(2);

        const notUploadedBadges = screen.getAllByText('Not Uploaded');
        expect(notUploadedBadges).toHaveLength(1);
    });

    it('Scenario 4: All three documents uploaded', () => {
        render(
            <IdentityCard
                {...defaultProps}
                customerDocuments={{
                    id_card: 'https://example.com/id.jpg',
                    full_photo: 'https://example.com/photo.jpg',
                    video_recordings: [{ url: 'https://example.com/video.mp4', duration: 60 }] as any,
                } as any}
                consultationFlags={{
                    has_id_card: true,
                    has_full_photo: true,
                    has_video_recording: true,
                } as any}
            />
        );

        const viewButtons = screen.getAllByRole('button', { name: /view/i });
        expect(viewButtons).toHaveLength(3);
        expect(screen.queryByText('Not Uploaded')).not.toBeInTheDocument();
    });

    it('Scenario 5: Document record/flag exists but file is missing or empty string', () => {
        render(
            <IdentityCard
                {...defaultProps}
                customerDocuments={{
                    id_card: '',
                    full_photo: null,
                    video_recordings: [],
                } as any}
                consultationFlags={{
                    has_id_card: true,
                    has_full_photo: false,
                    has_video_recording: false,
                } as any}
            />
        );

        // Empty file URL should NOT display a View button
        expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument();
        expect(screen.getAllByText('Not Uploaded')).toHaveLength(3);
    });
});
