import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleVideoAction, handlePrescriptionAction, handleDocumentAction } from '../../utils/communication';
import { triggerVideoConsultation, triggerPrescriptionReminder, triggerDocumentReminder } from '@/api/services/orders/actions';

vi.mock('@/api/services/orders/actions', () => ({
    triggerVideoConsultation: vi.fn(),
    triggerPrescriptionReminder: vi.fn(),
    triggerDocumentReminder: vi.fn(),
}));

describe('Communication Utilities', () => {
    const mockOrder: any = {
        orderInfo: { 
            shopifyOrderId: 12345,
            orderId: 'ORD-123'
        },
        sendPrescriptionReminder: {
            actionUrl: 'https://api.example.com/prescription',
            payload: { type: 'reminder' }
        },
        sendDocumentReminder: {
            actionUrl: 'https://api.example.com/document/',
            payload: {}
        }
    };

    const mockShowModal = vi.fn();
    const mockHideModal = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    describe('handleVideoAction', () => {
        it('should show loader, trigger API, and show success modal', async () => {
            await handleVideoAction(mockOrder, mockShowModal, mockHideModal);
            expect(mockShowModal).toHaveBeenCalledWith('fullScreenLoader');
            expect(triggerVideoConsultation).toHaveBeenCalledWith('12345');
            expect(mockShowModal).toHaveBeenCalledWith('videoSuccessModal');
        });
    });

    describe('handlePrescriptionAction', () => {
        it('should format URL correctly and trigger API', async () => {
            await handlePrescriptionAction(mockOrder, mockShowModal, mockHideModal);
            expect(triggerPrescriptionReminder).toHaveBeenCalledWith(expect.objectContaining({
                actionUrl: 'https://api.example.com/prescription/12345'
            }));
            expect(mockShowModal).toHaveBeenCalledWith('prescriptionSuccessModal');
        });
    });

    describe('handleDocumentAction', () => {
        it('should handle URL with trailing slash correctly', async () => {
            await handleDocumentAction(mockOrder, mockShowModal, mockHideModal);
            expect(triggerDocumentReminder).toHaveBeenCalledWith(expect.objectContaining({
                actionUrl: 'https://api.example.com/document/12345'
            }));
            expect(mockShowModal).toHaveBeenCalledWith('documentSuccessModal');
        });
    });
});
