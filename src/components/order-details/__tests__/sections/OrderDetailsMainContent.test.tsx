import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderDetailsMainContent } from '../../sections/Main';
import { useUserInfo } from '@/store';
import { useResyncOrder } from '../../hooks/useResyncOrder';

vi.mock('@/store', () => ({
    useUserInfo: vi.fn(),
}));

vi.mock('../../hooks/useResyncOrder', () => ({
    useResyncOrder: vi.fn(),
}));

vi.mock('../../sections/InfoCards/index', () => ({
    InfoCards: () => <div data-testid="info-cards" />,
}));

vi.mock('../../sections/DocumentPrescription/index', () => ({
    DocumentPrescriptionSection: () => <div data-testid="document-prescription" />,
}));

vi.mock('../../sections/Consultation/index', () => ({
    ConsultationSection: () => <div data-testid="consultation" />,
}));

vi.mock('../../sections/Communication', () => ({
    CommunicationSection: () => <div data-testid="communication" />,
}));

vi.mock('../../sections/InternalNotes/index', () => ({
    InternalNotesSection: () => <div data-testid="internal-notes" />,
}));

vi.mock('../../sections/SCR/index', () => ({
    ScrSection: () => <div data-testid="scr" />,
}));

vi.mock('../../sections/ActivityLogs', () => ({
    ActivityLogsSection: () => <div data-testid="activity" />,
}));

function createOrder(overrides: any = {}) {
    const orderInfoOverrides = overrides.orderInfo ?? {};
    const baseOrder = {
        products: [],
        productCategoryFlags: {},
        pharmacistInfo: {},
        consultationFlags: {
            sms_sent: false,
            postal_sent: false,
        },
        activityLogs: [],
        customerInfo: { id: 1 },
        repeatedOrders: 0,
        lastPreviousOrder: null,
    };

    return {
        ...baseOrder,
        ...overrides,
        orderInfo: {
            status: 'pending',
            fulfillmentStatus: 'unfulfilled',
            shopifyOrderId: 123,
            resyncedAt: null,
            ...orderInfoOverrides,
        },
    };
}

describe('OrderDetailsMainContent', () => {
    const handleResync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();

        vi.mocked(useUserInfo).mockReturnValue({
            effectiveRole: 'admin',
        } as any);

        vi.mocked(useResyncOrder).mockReturnValue({
            isLoading: false,
            isSuccess: false,
            error: null,
            handleResync,
        });
    });

    it('auto-triggers resync once when resyncedAt is missing', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'true');

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: null } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        await waitFor(() => {
            expect(handleResync).toHaveBeenCalledTimes(1);
        });
        expect(handleResync).toHaveBeenCalledWith('mongo-order-1');
    });

    it('does not auto-trigger resync when resyncedAt exists', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'true');

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: '2026-04-27T10:00:00.000Z' } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        await waitFor(() => {
            expect(handleResync).not.toHaveBeenCalled();
        });

        expect(screen.getByText(/Last re-synced:/i)).toBeInTheDocument();
    });

    it('does not auto-trigger resync when auto-resync env is disabled', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'false');

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: null } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        await waitFor(() => {
            expect(handleResync).not.toHaveBeenCalled();
        });
    });

    it('auto-triggers resync when env is set to 1', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', '1');

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: null } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        await waitFor(() => {
            expect(handleResync).toHaveBeenCalledTimes(1);
        });
    });

    it('auto-triggers resync when PUBLIC_AUTO_RESYNC is true', async () => {
        vi.stubEnv('PUBLIC_AUTO_RESYNC', 'true');

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: null } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        await waitFor(() => {
            expect(handleResync).toHaveBeenCalledTimes(1);
        });
    });

    it('shows the Re-Sync button for prescriber role', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'false');
        vi.mocked(useUserInfo).mockReturnValue({
            effectiveRole: 'prescriber',
        } as any);

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: null } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        expect(screen.getByRole('button', { name: /re-sync/i })).toBeInTheDocument();
    });

    it('hides the Re-Sync button for non-medical user role', async () => {
        vi.stubEnv('VITE_AUTO_RESYNC', 'false');
        vi.mocked(useUserInfo).mockReturnValue({
            effectiveRole: 'user',
        } as any);

        render(
            <OrderDetailsMainContent
                order={createOrder({ orderInfo: { resyncedAt: null } })}
                orderId="mongo-order-1"
                isReadOnly={false}
                scrState={{
                    reviewedBy: '',
                    isReviewed: false,
                    scrFlags: {},
                    scrComments: '',
                    setScrComments: vi.fn(),
                    reviewedAt: '',
                    regNo: '',
                    handleToggleScr: vi.fn(),
                    approveChecked: false,
                    setApproveChecked: vi.fn(),
                    handleSubmitSCR: vi.fn(),
                    setShowDeclinePopup: vi.fn(),
                }}
                commActions={{ handleCommunicationAction: vi.fn() }}
                imageSlider={{ handleView: vi.fn() }}
                showModal={vi.fn()}
                formattedCreatedAt="2026-04-27"
            />,
        );

        expect(screen.queryByRole('button', { name: /re-sync/i })).not.toBeInTheDocument();
    });
});
