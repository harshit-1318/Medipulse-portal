import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    updateLead,
    updateLeadStatus,
    assignLead,
    addLeadNote,
} from './leadService';

const { mockPost, mockPut, mockPatch } = vi.hoisted(() => ({
    mockPost: vi.fn(),
    mockPut: vi.fn(),
    mockPatch: vi.fn(),
}));

vi.mock('@/api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        post: mockPost,
        put: mockPut,
        patch: mockPatch,
        delete: vi.fn(),
    },
}));

describe('leadService Mutations', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('updateLead', () => {
        it('calls PUT /leads/:id with full or partial payload', async () => {
            mockPut.mockResolvedValue({ id: 'l1', status: 'contacted' });
            await updateLead('l1', { status: 'contacted', assignedTo: 'u1' });
            expect(mockPut).toHaveBeenCalledWith('/leads/l1', { status: 'contacted', assignedTo: 'u1' });

            await updateLead('l1', { assignedTo: null });
            expect(mockPut).toHaveBeenCalledWith('/leads/l1', { assignedTo: null });
        });
    });

    describe('updateLeadStatus', () => {
        it('calls PATCH /leads/:id/status with status', async () => {
            mockPatch.mockResolvedValue({ status: 'qualified' });
            await updateLeadStatus('l1', 'qualified');
            expect(mockPatch).toHaveBeenCalledWith('/leads/l1/status', { status: 'qualified' });
        });
    });

    describe('assignLead', () => {
        it('calls PATCH /leads/:id/assign with userId or null', async () => {
            mockPatch.mockResolvedValue({ assignedTo: { id: 'u2' } });
            await assignLead('l1', 'u2');
            expect(mockPatch).toHaveBeenCalledWith('/leads/l1/assign', { userId: 'u2' });

            await assignLead('l1', null);
            expect(mockPatch).toHaveBeenCalledWith('/leads/l1/assign', { userId: null });
        });
    });

    describe('addLeadNote', () => {
        it('calls POST /leads/:id/notes with text', async () => {
            mockPost.mockResolvedValue({ id: 'n1', text: 'Follow up' });
            await addLeadNote('l1', 'Follow up');
            expect(mockPost).toHaveBeenCalledWith('/leads/l1/notes', { text: 'Follow up' });
        });
    });
});
