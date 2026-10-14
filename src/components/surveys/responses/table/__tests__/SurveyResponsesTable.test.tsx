import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SurveyResponsesTable } from '../SurveyResponsesTable';
import type { SurveyResponse } from '@/types/survey';

describe('SurveyResponsesTable Component', () => {
  it('renders empty placeholder when items array is empty or undefined', () => {
    render(
      <SurveyResponsesTable
        items={[]}
        total={0}
        page={1}
        loading={false}
        onPageChange={vi.fn()}
        onSelectResponse={vi.fn()}
        onDeleteResponse={vi.fn()}
      />
    );

    expect(screen.getByText('No responses yet')).toBeInTheDocument();
  });

  it('renders table rows for heterogeneous response items without throwing errors', () => {
    const items: SurveyResponse[] = [
      {
        _id: 'resp_1',
        customer: { _id: 'c1', name: 'Diana Prince', email: 'diana@themyscira.com' },
        survey: { _id: 's1', title: 'Consultation Form' },
        submittedAt: '2026-10-14T08:30:00.000Z',
      },
      {
        _id: 'resp_2',
        customerName: 'Bruce Wayne',
        customerEmail: 'bruce@waynecorp.com',
        surveyTitle: 'Annual Checkup',
        createdAt: '2026-10-15T09:00:00.000Z',
      },
    ];

    render(
      <SurveyResponsesTable
        items={items}
        total={2}
        page={1}
        loading={false}
        onPageChange={vi.fn()}
        onSelectResponse={vi.fn()}
        onDeleteResponse={vi.fn()}
      />
    );

    expect(screen.getByText('Diana Prince')).toBeInTheDocument();
    expect(screen.getByText('Bruce Wayne')).toBeInTheDocument();
    expect(screen.getByText('Consultation Form')).toBeInTheDocument();
    expect(screen.getByText('Annual Checkup')).toBeInTheDocument();
  });
});
