import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderDetailsMainContent } from '../../sections/Main';
import { useUserInfo } from '@/store';
import { useResyncOrder } from '../../hooks/resync/useResyncOrder';

vi.mock('@/store', () => ({ useUserInfo: vi.fn() }));
vi.mock('../../hooks/resync/useResyncOrder', () => ({ useResyncOrder: vi.fn() }));
vi.mock('../../sections/InfoCards/index', () => ({ InfoCards: () => null }));
vi.mock('../../sections/DocumentPrescription/index', () => ({ DocumentPrescriptionSection: () => null }));
vi.mock('../../sections/Consultation/index', () => ({ ConsultationSection: () => null }));
vi.mock('../../sections/Communication', () => ({ CommunicationSection: () => null }));
vi.mock('../../sections/InternalNotes/index', () => ({ InternalNotesSection: () => null }));
vi.mock('../../sections/SCR/index', () => ({ ScrSection: () => null }));
vi.mock('../../sections/ActivityLogs', () => ({ ActivityLogsSection: () => null }));

const defaultScrState = {
    reviewedBy: '', isReviewed: false, scrFlags: {}, scrComments: '', setScrComments: vi.fn(),
    reviewedAt: '', regNo: '', handleToggleScr: vi.fn(), approveChecked: false, setApproveChecked: vi.fn(),
    handleSubmitSCR: vi.fn(), setShowDeclinePopup: vi.fn(),
};

const createOrder = (resyncedAt: string | null = null) => ({
    products: [], productCategoryFlags: {}, pharmacistInfo: {},
    consultationFlags: { sms_sent: false, postal_sent: false },
    activityLogs: [], customerInfo: { id: 1 }, repeatedOrders: 0, lastPreviousOrder: null,
    orderInfo: { status: 'pending', fulfillmentStatus: 'unfulfilled', shopifyOrderId: 123, resyncedAt },
});

const renderMain = (order = createOrder(null)) => render(
    <OrderDetailsMainContent
        order={order as any} orderId="mongo-order-1" isReadOnly={false} scrState={defaultScrState}
        commActions={{ handleCommunicationAction: vi.fn() }} imageSlider={{ handleView: vi.fn() }}
        showModal={vi.fn()} formattedCreatedAt="2026-04-27"
    />
);

describe('OrderDetailsMainContent — auto-resync', () => {
    const handleResync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
        vi.mocked(useUserInfo).mockReturnValue({ effectiveRole: 'admin' } as any);
        vi.mocked(useResyncOrder).mockReturnValue({ isLoading: false, isSuccess: false, error: null, handleResync });
    });

    it('auto-triggers resync once when resyncedAt is missing', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'true');
        renderMain();
        await waitFor(() => expect(handleResync).toHaveBeenCalledWith('mongo-order-1'));
    });

    it('does not auto-trigger resync when resyncedAt exists', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'true');
        renderMain(createOrder('2026-04-27T10:00:00.000Z'));
        await waitFor(() => expect(handleResync).not.toHaveBeenCalled());
        expect(screen.getByText(/Last re-synced:/i)).toBeInTheDocument();
    });

    it('does not auto-trigger resync when auto-resync env is false', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'false');
        renderMain();
        await waitFor(() => expect(handleResync).not.toHaveBeenCalled());
    });

    it.each([['VITE_AUTO_RESYNC', '1'], ['PUBLIC_AUTO_RESYNC', 'true']])(
        'auto-triggers resync when %s is %s',
        async (envKey, envVal) => {
            vi.stubEnv(envKey, envVal);
            renderMain();
            await waitFor(() => expect(handleResync).toHaveBeenCalledTimes(1));
        }
    );
});
