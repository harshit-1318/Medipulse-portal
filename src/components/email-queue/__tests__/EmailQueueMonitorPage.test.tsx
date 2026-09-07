import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EmailQueueMonitorPage from '../EmailQueueMonitorPage';

const mockGetEmailQueueOverview = vi.fn();

vi.mock('@/api/services/email-queue/emailQueueService', () => ({
    getEmailQueueOverview: (...args: any[]) => mockGetEmailQueueOverview(...args),
}));

describe('EmailQueueMonitorPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders queue summary and recent jobs', async () => {
        mockGetEmailQueueOverview.mockResolvedValue({
            summary: {
                pending: 2,
                processing: 1,
                completed: 5,
                failed: 0,
                total: 8,
                duePending: 1,
                retryPending: 1,
            },
            jobs: [
                {
                    id: 'job-1',
                    jobKey: 'site1:100:first',
                    siteId: 'site-1',
                    orderId: 100,
                    reminderType: 'first',
                    status: 'pending',
                    attempts: 0,
                    availableAt: '2026-04-28T12:00:00.000Z',
                    startedAt: null,
                    processedAt: null,
                    lastError: null,
                    createdAt: '2026-04-28T12:00:00.000Z',
                    updatedAt: '2026-04-28T12:00:00.000Z',
                },
            ],
            generatedAt: '2026-04-28T12:00:00.000Z',
        });

        render(<EmailQueueMonitorPage />);

        expect(await screen.findByText('Email Queue Monitor')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('#100')).toBeInTheDocument();
            expect(screen.getByText('pending')).toBeInTheDocument();
            expect(screen.getByText('8')).toBeInTheDocument();
        });
    });

    it('shows empty-state row when no jobs are returned', async () => {
        mockGetEmailQueueOverview.mockResolvedValue({
            summary: {
                pending: 0,
                processing: 0,
                completed: 0,
                failed: 0,
                total: 0,
                duePending: 0,
                retryPending: 0,
            },
            jobs: [],
            generatedAt: '2026-04-28T12:00:00.000Z',
        });

        render(<EmailQueueMonitorPage />);

        expect(await screen.findByText('No queue jobs available.')).toBeInTheDocument();
    });
});
