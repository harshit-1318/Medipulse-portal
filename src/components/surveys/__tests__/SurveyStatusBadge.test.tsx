import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import SurveyStatusBadge from '../components/SurveyStatusBadge';

describe('SurveyStatusBadge', () => {
    it('renders "Published" for published status', () => {
        render(<SurveyStatusBadge status="published" />);
        expect(screen.getByText('Published')).toBeDefined();
    });

    it('renders "Draft" for draft status', () => {
        render(<SurveyStatusBadge status="draft" />);
        expect(screen.getByText('Draft')).toBeDefined();
    });

    it('applies green styling for published', () => {
        const { container } = render(<SurveyStatusBadge status="published" />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('text-emerald-700');
    });

    it('applies grey styling for draft', () => {
        const { container } = render(<SurveyStatusBadge status="draft" />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('text-slate-500');
    });

    it('published badge has a green dot', () => {
        const { container } = render(<SurveyStatusBadge status="published" />);
        const dot = container.querySelectorAll('span')[1];
        expect(dot?.className).toContain('bg-emerald-500');
    });

    it('draft badge has a grey dot', () => {
        const { container } = render(<SurveyStatusBadge status="draft" />);
        const dot = container.querySelectorAll('span')[1];
        expect(dot?.className).toContain('bg-slate-400');
    });
});
