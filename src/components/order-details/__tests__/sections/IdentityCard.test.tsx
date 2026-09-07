import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IdentityCard } from '../../sections/DocumentPrescription/components/IdentityCard';

// Mock child components so tests focus on age-verified logic only
vi.mock('../../components/DocumentRow', () => ({
    DocumentRow: () => null,
}));
vi.mock('../../sections/DocumentPrescription/components/IdentityDocumentRows', () => ({
    IdentityDocumentRows: () => null,
}));

/** Minimal props that satisfy IdentityCard without triggering unrelated renders */
const baseProps = {
    customerDocuments: {
        id_card: null,
        full_photo: null,
        review_full_photo: null,
        previous_prescriptions: [],
        previous_prescriptions_count: 0,
        video_recordings: [],
    } as any,
    consultationFlags: {
        has_full_photo: false,
        has_id_card: false,
        has_video_recording: false,
        consultation_reviewed: false,
        image_id_verified: false,
        scr_accessed: false,
    } as any,
    sixMonthReview: undefined,
    handleView: vi.fn(),
    handleViewPrescriptionList: vi.fn(),
    onViewVideoRecordings: vi.fn(),
    isWeightLoss: false,
};

function buildOrder(tags: string | string[] | null, ageVerifiedReview?: any, products?: any[]) {
    return {
        orderInfo: { tags },
        products: products ?? [{ name: 'Sildenafil 50mg' }],
        ageVerifiedReview: ageVerifiedReview ?? null,
    };
}

// ─── ageVerifiedTags filter logic ────────────────────────────────────────────

describe('IdentityCard — age verified tag detection', () => {
    it('shows Age Verified Tag section when order tag is exactly "ageverified"', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['ageverified'])} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
    });

    it('shows Age Verified Tag section when tag is "Age Verified" (mixed case with space)', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['Age Verified'])} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
    });

    it('shows Age Verified Tag section when tag contains "ageverified" as substring', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['customer-ageverified-uk'])} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
    });

    it('does NOT show Age Verified Tag section when no matching tags exist', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['prescription', 'weightloss'])} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
    });

    it('does NOT show Age Verified Tag section when tags are null', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(null)} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
    });

    it('does NOT show Age Verified Tag section when tags is an empty array', () => {
        render(<IdentityCard {...baseProps} order={buildOrder([])} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
    });

    it('parses comma-separated string tags and detects age verified tag', () => {
        render(<IdentityCard {...baseProps} order={buildOrder('prescription, ageverified, weightloss')} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
    });

    it('renders the tag value as an uppercase badge', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['ageverified'])} />);
        // The badge displays the original tag value in uppercase via CSS, so check text
        expect(screen.getByText('ageverified')).toBeInTheDocument();
    });
});

// ─── Mounjaro / Wegovy suppression ───────────────────────────────────────────

describe('IdentityCard — Mounjaro/Wegovy suppresses age verified section', () => {
    it('hides Age Verified Tag section when order contains a Mounjaro product', () => {
        const order = buildOrder(['ageverified'], null, [{ name: 'Mounjaro 5mg Injectable' }]);
        render(<IdentityCard {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
    });

    it('hides Age Verified Tag section when order contains a Wegovy product', () => {
        const order = buildOrder(['ageverified'], null, [{ name: 'Wegovy 1mg Pen' }]);
        render(<IdentityCard {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
    });

    it('shows Age Verified Tag section when products contain neither Mounjaro nor Wegovy', () => {
        const order = buildOrder(['ageverified'], null, [{ name: 'Sildenafil 50mg' }]);
        render(<IdentityCard {...baseProps} order={order} />);
        expect(screen.getByText('Age Verified Tag')).toBeInTheDocument();
    });
});

// ─── Tag-based display split ─────────────────────────────────────────────────

describe('IdentityCard — tag-based display split', () => {
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

    it('shows neither row when only unrelated tags are present', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['prescription', 'weightloss'])} />);
        expect(screen.queryByText('Age Verified Tag')).not.toBeInTheDocument();
        expect(screen.queryByText('Manual Age Verified')).not.toBeInTheDocument();
    });

    it('does NOT show Manual Age Verified row for "age verified" tag even when emailSent is true', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['age verified'], review)} />);
        expect(screen.queryByText('Manual Age Verified')).not.toBeInTheDocument();
        expect(screen.queryByText(/✓ Verified/i)).not.toBeInTheDocument();
    });
});

// ─── Manual Age Verified status ───────────────────────────────────────────────
// All tests use "pending age verification" — the Manual Age Verified row only
// renders for that tag, not for "age verified".

describe('IdentityCard — Manual Age Verified status', () => {
    it('shows "✓ Verified" badge when ageVerifiedReview.emailSent is true', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], review)} />);
        expect(screen.getByText(/✓ Verified/i)).toBeInTheDocument();
    });

    it('shows "Not Verified" badge when ageVerifiedReview.emailSent is false', () => {
        const review = { emailSent: false, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], review)} />);
        expect(screen.getByText('Not Verified')).toBeInTheDocument();
    });

    it('shows "Not Verified" badge when ageVerifiedReview is null', () => {
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], null)} />);
        expect(screen.getByText('Not Verified')).toBeInTheDocument();
    });

    it('shows formatted sentAt date when emailSent is true and sentAt is provided', () => {
        const review = { emailSent: true, sentAt: '2024-05-15T09:30:00Z', sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], review)} />);
        // en-GB locale: "15 May 2024, 09:30"
        expect(screen.getByText(/15 May 2024/)).toBeInTheDocument();
    });

    it('does not render sentAt text when emailSent is true but sentAt is null', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], review)} />);
        expect(screen.queryByText(/2024/)).not.toBeInTheDocument();
    });

    it('shows sentBy name when emailSent is true and sentBy is provided', () => {
        const review = { emailSent: true, sentAt: null, sentBy: 'pharmacist@clinic.com' };
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], review)} />);
        expect(screen.getByText('pharmacist@clinic.com')).toBeInTheDocument();
    });

    it('does not render sentBy element when sentBy is null', () => {
        const review = { emailSent: true, sentAt: null, sentBy: null };
        render(<IdentityCard {...baseProps} order={buildOrder(['pending age verification'], review)} />);
        expect(screen.queryByText('pharmacist@clinic.com')).not.toBeInTheDocument();
    });
});
