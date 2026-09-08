import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderDetailsMainContent } from '../../sections/Main';
import { useUserInfo } from '@/store';
import { useResyncOrder } from '../../hooks/resync/useResyncOrder';

vi.mock('@/store', () => ({ useUserInfo: vi.fn() }));
vi.mock('../../hooks/resync/useResyncOrder', () => ({ useResyncOrder: vi.fn() }));
vi.mock('../../sections/InfoCards/index', () => ({ InfoCards: () => <div data-testid="info-cards" /> }));
vi.mock('../../sections/DocumentPrescription/index', () => ({ DocumentPrescriptionSection: () => <div data-testid="document-prescription" /> }));
vi.mock('../../sections/Consultation/index', () => ({ ConsultationSection: () => <div data-testid="consultation" /> }));
vi.mock('../../sections/Communication', () => ({ CommunicationSection: () => <div data-testid="communication" /> }));
vi.mock('../../sections/InternalNotes/index', () => ({ InternalNotesSection: () => <div data-testid="internal-notes" /> }));
vi.mock('../../sections/SCR/index', () => ({ ScrSection: () => <div data-testid="scr" /> }));
vi.mock('../../sections/ActivityLogs', () => ({ ActivityLogsSection: () => <div data-testid="activity" /> }));

const defaultScrState = {
    reviewedBy: '', isReviewed: false, scrFlags: {}, scrComments: '', setScrComments: vi.fn(),
    reviewedAt: '', regNo: '', handleToggleScr: vi.fn(), approveChecked: false, setApproveChecked: vi.fn(),
    handleSubmitSCR: vi.fn(), setShowDeclinePopup: vi.fn(),
};

const createOrder = () => ({
    products: [], productCategoryFlags: {}, pharmacistInfo: {},
    consultationFlags: { sms_sent: false, postal_sent: false },
    activityLogs: [], customerInfo: { id: 1 }, repeatedOrders: 0, lastPreviousOrder: null,
    orderInfo: { status: 'pending', fulfillmentStatus: 'unfulfilled', shopifyOrderId: 123, resyncedAt: null },
});

const renderMain = () => render(
    <OrderDetailsMainContent
        order={createOrder() as any} orderId="mongo-order-1" isReadOnly={false} scrState={defaultScrState}
        commActions={{ handleCommunicationAction: vi.fn() }} imageSlider={{ handleView: vi.fn() }}
        showModal={vi.fn()} formattedCreatedAt="2026-04-27"
    />
);

describe('OrderDetailsMainContent — role-based UI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
        vi.stubEnv('VITE_AUTO_RESYNC', 'false');
        vi.mocked(useResyncOrder).mockReturnValue({ isLoading: false, isSuccess: false, error: null, handleResync: vi.fn() });
    });

    it('shows the Re-Sync button for prescriber role', () => {
        vi.mocked(useUserInfo).mockReturnValue({ effectiveRole: 'prescriber' } as any);
        renderMain();
        expect(screen.getByRole('button', { name: /re-sync/i })).toBeInTheDocument();
    });

    it('shows the Re-Sync button for admin role', () => {
        vi.mocked(useUserInfo).mockReturnValue({ effectiveRole: 'admin' } as any);
        renderMain();
        expect(screen.getByRole('button', { name: /re-sync/i })).toBeInTheDocument();
    });

    it('hides the Re-Sync button for non-medical user role', () => {
        vi.mocked(useUserInfo).mockReturnValue({ effectiveRole: 'user' } as any);
        renderMain();
        expect(screen.queryByRole('button', { name: /re-sync/i })).not.toBeInTheDocument();
    });
});
