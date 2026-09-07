import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommunicationActionsGrid } from '../../sections/Communication';

vi.mock('@/components/surveys/SendSurveyModal', () => ({
    default: () => null,
}));

const baseOrder = {
    customerInfo: { id: '123' },
    orderInfo: { orderId: 'ORD-001', tags: [] as string[] },
    products: [{ name: 'Sildenafil 50mg' }],
    sendVideoConsultation: { enabled: false },
    sendPrescriptionReminder: { enabled: false },
    sendDocumentReminder: { enabled: false },
    sendMessage: { enabled: false },
    sendGpEmail: { enabled: false },
    ageVerifiedEmail: { enabled: true, actionUrl: '/api/age-verify/123', method: 'POST' },
} as any;

const baseProps = {
    isReadOnly: false,
    isCancelled: false,
    isSending: false,
    onAction: vi.fn(),
};

// ─── Age Verification button visibility ───────────────────────────────────────

describe('CommunicationActionsGrid — Age Verification button visibility', () => {
    it('does NOT show button when tag is "age verified"', () => {
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: ['age verified'] } };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });

    it('shows button when tag is "pending age verification"', () => {
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: ['pending age verification'] } };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.getByText('Age Verification')).toBeInTheDocument();
    });

    it('shows button when tag is "Pending Age Verification" (mixed case)', () => {
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: ['Pending Age Verification'] } };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.getByText('Age Verification')).toBeInTheDocument();
    });

    it('shows button when tags is a comma-separated string containing "pending age verification"', () => {
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: 'prescription, pending age verification' } };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.getByText('Age Verification')).toBeInTheDocument();
    });

    it('does NOT show button when no age-related tags exist', () => {
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: ['prescription'] } };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });

    it('does NOT show button when tags are empty', () => {
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: [] } };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });

    it('does NOT show button when ageVerifiedEmail is absent from order', () => {
        const order = {
            ...baseOrder,
            orderInfo: { ...baseOrder.orderInfo, tags: ['pending age verification'] },
            ageVerifiedEmail: undefined,
        };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });
});

// ─── Mounjaro / Wegovy suppression ───────────────────────────────────────────

describe('CommunicationActionsGrid — Mounjaro/Wegovy suppresses Age Verification button', () => {
    it('hides button for Mounjaro product even with "pending age verification" tag', () => {
        const order = {
            ...baseOrder,
            orderInfo: { ...baseOrder.orderInfo, tags: ['pending age verification'] },
            products: [{ name: 'Mounjaro 5mg Injectable' }],
        };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });

    it('hides button for Wegovy product even with "pending age verification" tag', () => {
        const order = {
            ...baseOrder,
            orderInfo: { ...baseOrder.orderInfo, tags: ['pending age verification'] },
            products: [{ name: 'Wegovy 1mg Pen' }],
        };
        render(<CommunicationActionsGrid {...baseProps} order={order} />);
        expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });
});

// ─── Button click ─────────────────────────────────────────────────────────────

describe('CommunicationActionsGrid — Age Verification button click', () => {
    it('calls onAction("age_verification") when button is clicked', () => {
        const onAction = vi.fn();
        const order = { ...baseOrder, orderInfo: { ...baseOrder.orderInfo, tags: ['pending age verification'] } };
        render(<CommunicationActionsGrid {...baseProps} onAction={onAction} order={order} />);
        fireEvent.click(screen.getByText('Ask Age Verification'));
        expect(onAction).toHaveBeenCalledWith('age_verification');
    });
});
