import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailySparkline } from '../activity-dashboard/Charts';

describe('DailySparkline', () => {
    it('renders empty message when byDay is empty', () => {
        render(<DailySparkline byDay={[]} />);
        expect(screen.getByText(/No events in selected period/i)).toBeInTheDocument();
    });

    it('renders correct number of bar elements for given days', () => {
        const today = new Date().toISOString().split('T')[0];
        const { container } = render(
            <DailySparkline byDay={[{ date: today, count: 50 }]} days={7} />
        );

        // 7 days generates 7 bar elements inside the chart container
        const bars = container.querySelectorAll('.cursor-pointer');
        expect(bars.length).toBe(7);

        // Date labels (Start date and Today) are displayed
        expect(screen.getByText(/Today/i)).toBeInTheDocument();
    });

    it('accurately styles active event bars with brand color and tooltip', () => {
        const today = new Date().toISOString().split('T')[0];
        const { container } = render(
            <DailySparkline byDay={[{ date: today, count: 120 }]} days={7} />
        );

        const activeBars = container.querySelectorAll('.bg-\\[\\#00A294\\]');
        expect(activeBars.length).toBeGreaterThanOrEqual(1);

        const todayBar = Array.from(activeBars).find((bar) =>
            bar.getAttribute('title')?.includes('120 events')
        );
        expect(todayBar).toBeDefined();
    });
});
