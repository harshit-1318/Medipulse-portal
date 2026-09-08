import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IdentityCard } from '../../sections/DocumentPrescription/components/IdentityCard';

vi.mock('@/components/order-details/components', async (importOriginal) => {
    const actual = await importOriginal<Record<string, any>>();
    return { ...actual, DocumentRow: () => null };
});
vi.mock('../../sections/DocumentPrescription/components/IdentityDocumentRows', () => ({
    IdentityDocumentRows: () => null,
}));

const baseProps = {
    customerDocuments: { id_card: null, full_photo: null, review_full_photo: null, previous_prescriptions: [], previous_prescriptions_count: 0, video_recordings: [] } as any,
    consultationFlags: { has_full_photo: false, has_id_card: false, has_video_recording: false, consultation_reviewed: false, image_id_verified: false, scr_accessed: false } as any,
    sixMonthReview: undefined,
    handleView: vi.fn(),
    handleViewPrescriptionList: vi.fn(),
    onViewVideoRecordings: vi.fn(),
    isWeightLoss: false,
};

const buildOrder = (ageVerifiedReview?: any) => ({
    orderInfo: { tags: ['pending age verification'] },
    products: [{ name: 'Sildenafil 50mg' }],
    ageVerifiedReview: ageVerifiedReview ?? null,
});

describe('IdentityCard — Manual Age Verified status', () => {
    it('shows "✓ Verified" badge when ageVerifiedReview.emailSent is true', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(review)} />);
        expect(screen.getByText(/✓ Verified/i)).toBeInTheDocument();
    });

    it('shows "Not Verified" badge when ageVerifiedReview.emailSent is false or null', () => {
        const { rerender } = render(<IdentityCard {...baseProps} order={buildOrder({ emailSent: false, sentAt: null, sentBy: null })} />);
        expect(screen.getByText('Not Verified')).toBeInTheDocument();

        rerender(<IdentityCard {...baseProps} order={buildOrder(null)} />);
        expect(screen.getByText('Not Verified')).toBeInTheDocument();
    });

    it('shows formatted sentAt date when emailSent is true and sentAt is provided', () => {
        const review = { emailSent: true, sentAt: '2024-05-15T09:30:00Z', sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(review)} />);
        expect(screen.getByText(/15 May 2024/)).toBeInTheDocument();
    });

    it('does not render sentAt text when emailSent is true but sentAt is null', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(review)} />);
        expect(screen.queryByText(/2024/)).not.toBeInTheDocument();
    });

    it('shows sentBy name when provided, and omits when null', () => {
        const reviewWithSender = { emailSent: true, sentAt: null, sentBy: 'pharmacist@clinic.com' };
        const { rerender } = render(<IdentityCard {...baseProps} order={buildOrder(reviewWithSender)} />);
        expect(screen.getByText('pharmacist@clinic.com')).toBeInTheDocument();

        const reviewWithoutSender = { emailSent: true, sentAt: null, sentBy: null };
        rerender(<IdentityCard {...baseProps} order={buildOrder(reviewWithoutSender)} />);
        expect(screen.queryByText('pharmacist@clinic.com')).not.toBeInTheDocument();
    });
});
