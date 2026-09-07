import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BmiGauge, getStickmanScale } from '../../sections/bmi/BmiGauge';
import { getBmiStatus, useBmiStatus } from '../../sections/bmi/hooks/useBmiStatus';

describe('BmiGauge', () => {
    it('renders the gauge with a specific BMI value', () => {
        const bmi = 25.5;
        render(<BmiGauge bmiDisplay="25.5" bmiStatus={getBmiStatus(bmi)} bmiProfile="standard" />);
        expect(screen.getByText('25.5')).toBeInTheDocument();
        expect(screen.getByText('Body Mass Index')).toBeInTheDocument();
    });

    it('renders the status text based on BMI', () => {
        const testBmi = (val: number, label: string, profile: 'standard' | 'ethnicity-adjusted' = 'standard') => {
            render(<BmiGauge bmiDisplay={String(val)} bmiStatus={getBmiStatus(val, profile)} bmiProfile={profile} />);
            // Multiple "Normal", "Underweight" etc. strings exist on the gauge scale vs badge.
            // We verify the one inside the status-badge.
            const badges = screen.getAllByText(new RegExp(label, 'i'));
            const activeBadge = badges.find(el => el.parentElement?.classList.contains('status-badge') || el.classList.contains('status-badge'));
            expect(activeBadge).toBeDefined();
        };

        testBmi(18.0, 'Underweight');
        testBmi(22.0, 'Normal');
        testBmi(27.0, 'Overweight');
        testBmi(32.0, 'Obese');
    });

    it('supports severely obese label for standard profile', () => {
        render(<BmiGauge bmiDisplay="41" bmiStatus={getBmiStatus(41, 'standard')} bmiProfile="standard" />);
        expect(screen.getByText('Severely Obese')).toBeInTheDocument();
    });

    it('matches badge color classes to gauge zone classes', () => {
        render(<BmiGauge bmiDisplay="32" bmiStatus={getBmiStatus(32, 'standard')} bmiProfile="standard" />);
        const obeseBadge = screen.getByText('Obese').closest('.status-badge');
        expect(obeseBadge).toBeTruthy();
        expect(obeseBadge?.className).toContain('bg-red-50/80');
        expect(obeseBadge?.className).toContain('text-red-700');
        expect(obeseBadge?.className).toContain('border-red-200/50');

        const obeseDot = obeseBadge?.querySelector('.status-badge-dot');
        expect(obeseDot?.className).toContain('bg-red-500');
    });

    it('uses fuchsia zone color for severely obese in standard profile', () => {
        render(<BmiGauge bmiDisplay="41" bmiStatus={getBmiStatus(41, 'standard')} bmiProfile="standard" />);
        const severeBadge = screen.getByText('Severely Obese').closest('.status-badge');
        expect(severeBadge).toBeTruthy();
        expect(severeBadge?.className).toContain('bg-fuchsia-50/80');
        expect(severeBadge?.className).toContain('text-fuchsia-700');
        expect(severeBadge?.className).toContain('border-fuchsia-200/50');
    });

    it('keeps obese as red zone in ethnicity-adjusted profile', () => {
        render(<BmiGauge bmiDisplay="45" bmiStatus={getBmiStatus(45, 'ethnicity-adjusted')} bmiProfile="ethnicity-adjusted" />);
        const badge = screen
            .getAllByText('Obese')
            .find(el => el.closest('.status-badge'))
            ?.closest('.status-badge');
        expect(badge).toBeTruthy();
        expect(badge?.className).toContain('bg-red-50/80');
        expect(screen.queryByText('Severely Obese')).not.toBeInTheDocument();
    });

    it('shows standard threshold note when ethnicity is not provided', () => {
        render(
            <BmiGauge
                bmiDisplay="31.0"
                bmiStatus={getBmiStatus(31, 'standard')}
                bmiProfile="standard"
                showStandardThresholdNote
            />
        );

        expect(screen.getByText('Using standard BMI thresholds (ethnicity not provided).')).toBeInTheDocument();
    });

    it('does not show standard threshold note when flag is false', () => {
        render(
            <BmiGauge
                bmiDisplay="31.0"
                bmiStatus={getBmiStatus(31, 'standard')}
                bmiProfile="standard"
            />
        );

        expect(screen.queryByText('Using standard BMI thresholds (ethnicity not provided).')).not.toBeInTheDocument();
    });
});

describe('useBmiStatus', () => {
    it('calculates correct status for various BMI values', () => {
        expect(useBmiStatus("18.0").bmiStatus.label).toBe("Underweight");
        expect(useBmiStatus("22.0").bmiStatus.label).toBe("Normal");
        expect(useBmiStatus("27.0").bmiStatus.label).toBe("Overweight");
        expect(useBmiStatus("32.0").bmiStatus.label).toBe("Obese");
        expect(useBmiStatus("39.9").bmiStatus.label).toBe("Obese");
        expect(useBmiStatus("40.0").bmiStatus.label).toBe("Severely Obese");
    });

    it('uses lower thresholds for ethnicity-adjusted profile', () => {
        expect(useBmiStatus("22.9", "ethnicity-adjusted").bmiStatus.label).toBe("Normal");
        expect(useBmiStatus("23.0", "ethnicity-adjusted").bmiStatus.label).toBe("Overweight");
        expect(useBmiStatus("27.4", "ethnicity-adjusted").bmiStatus.label).toBe("Overweight");
        expect(useBmiStatus("27.5", "ethnicity-adjusted").bmiStatus.label).toBe("Obese");
    });

    it('does not use severely obese label in ethnicity-adjusted profile', () => {
        expect(useBmiStatus("45.0", "ethnicity-adjusted").bmiStatus.label).toBe("Obese");
    });

    it('keeps standard-profile pointer in matching zone positions', () => {
        const normalPos = parseFloat(useBmiStatus("24.35", "standard").bmiStatus.pos);
        const overweightPos = parseFloat(useBmiStatus("28", "standard").bmiStatus.pos);
        const obesePos = parseFloat(useBmiStatus("35", "standard").bmiStatus.pos);

        expect(normalPos).toBeGreaterThanOrEqual(18.5);
        expect(normalPos).toBeLessThan(25);

        expect(overweightPos).toBeGreaterThanOrEqual(25);
        expect(overweightPos).toBeLessThan(30);

        expect(obesePos).toBeGreaterThanOrEqual(30);
        expect(obesePos).toBeLessThan(40);
    });

    it('keeps ethnicity-adjusted overweight pointer out of obese zone', () => {
        const overweightPos = parseFloat(useBmiStatus("24.5", "ethnicity-adjusted").bmiStatus.pos);
        expect(overweightPos).toBeGreaterThanOrEqual(23);
        expect(overweightPos).toBeLessThan(27.5);
    });
});

describe('getStickmanScale', () => {
    it('returns thinner scale at lower BMI and fuller scale at higher BMI', () => {
        const low = getStickmanScale('16');
        const mid = getStickmanScale('27');
        const high = getStickmanScale('42');

        expect(low.torsoScale).toBeLessThan(mid.torsoScale);
        expect(mid.torsoScale).toBeLessThan(high.torsoScale);
        expect(low.limbScale).toBeLessThan(high.limbScale);
    });

    it('clamps scale at min and max BMI bounds', () => {
        const below = getStickmanScale('1');
        const atMin = getStickmanScale('15');
        const above = getStickmanScale('100');
        const atMax = getStickmanScale('45');

        expect(below).toEqual(atMin);
        expect(above).toEqual(atMax);
    });

    it('shows visibly thicker scale for overweight than normal', () => {
        const normal = getStickmanScale('24.35');
        const overweight = getStickmanScale('28');
        expect(overweight.torsoScale - normal.torsoScale).toBeGreaterThan(0.14);
        expect(overweight.limbScale - normal.limbScale).toBeGreaterThan(0.08);
    });
});
