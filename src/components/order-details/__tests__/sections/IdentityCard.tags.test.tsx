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

const buildOrder = (tags: string | string[] | null, ageVerifiedReview?: any, products?: any[]) => ({
    orderInfo: { tags },
    products: products ?? [{ name: 'Sildenafil 50mg' }],
    ageVerifiedReview: ageVerifiedReview ?? null,
});

describe('IdentityCard — age verified tag detection & suppression', () => {
    it.each([
        ['ageverified'],
        ['Age Verified'],
        ['customer-ageverified-uk'],
        ['prescription, ageverified, weightloss'],
    ])('shows Age Verified Tag section for matching tag %s', (tag) => {
        render(<IdentityCard {...baseProps} order={buildOrder(tag)} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
    });

    it.each([
        [['prescription', 'weightloss']],
        [null],
        [[]],
    ])('does NOT show Age Verified Tag section for non-matching tags', (tags) => {
        render(<IdentityCard {...baseProps} order={buildOrder(tags)} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
    });

    it('renders the tag value as an uppercase badge', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['ageverified'])} />);
        expect(screen.getByText('ageverified')).toBeInTheDocument();
    });

    it.each(['Mounjaro 5mg Injectable', 'Wegovy 1mg Pen'])(
        'hides Age Verified Tag section when order contains %s',
        (productName) => {
            const order = buildOrder(['ageverified'], null, [{ name: productName }]);
            render(<IdentityCard {...baseProps} order={order} />);
            expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
        }
    );

    it('shows Age Verified Tag row but NOT Manual Age Verified row for "age verified" tag', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['age verified'])} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
        expect(screen.queryByText('Manual Age Verified')).not.toBeInTheDocument();
    });

    it('shows both Age Verified Tag row and Manual Age Verified row for "pending age verification" tag', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'])} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
        expect(screen.getByText('Manual Age Verified')).toBeInTheDocument();
    });

    it('does NOT show Manual Age Verified row for "age verified" tag even when emailSent is true', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['age verified'], review)} />);
        expect(screen.queryByText('Manual Age Verified')).not.toBeInTheDocument();
        expect(screen.queryByText(/✓ Verified/i)).not.toBeInTheDocument();
    });
});
