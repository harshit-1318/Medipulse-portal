import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import LeadStatusBadge from '../components/LeadStatusBadge';
import type { LeadStatus } from '@/types/lead';

describe('LeadStatusBadge', () => {
    const cases: Array<[LeadStatus, string, string]> = [
        ['new',       'New',       'text-blue-700'],
        ['contacted', 'Contacted', 'text-yellow-700'],
        ['qualified', 'Qualified', 'text-purple-700'],
        ['closed',    'Closed',    'text-emerald-700'],
        ['lost',      'Lost',      'text-red-700'],
    ];

    it.each(cases)('renders label "%s" for status %s', (status, label) => {
        render(<LeadStatusBadge status={status} />);
        expect(screen.getByText(label)).toBeDefined();
    });

    it.each(cases)('applies correct colour class for %s', (status, _label, colorClass) => {
        const { container } = render(<LeadStatusBadge status={status} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain(colorClass);
    });

    it('renders the correct dot colour for "new"', () => {
        const { container } = render(<LeadStatusBadge status="new" />);
        const dot = container.querySelectorAll('span')[1];
        expect(dot?.className).toContain('bg-blue-500');
    });

    it('renders the correct dot colour for "lost"', () => {
        const { container } = render(<LeadStatusBadge status="lost" />);
        const dot = container.querySelectorAll('span')[1];
        expect(dot?.className).toContain('bg-red-400');
    });
});
