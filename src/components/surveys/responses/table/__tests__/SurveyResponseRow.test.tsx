import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SurveyResponseRow } from '../SurveyResponseRow';
import type { SurveyResponse } from '@/types/survey';

describe('SurveyResponseRow Component', () => {
  const dummyFormatDate = (iso?: string) => (iso ? '15 Oct 2026' : '—');

  it('renders successfully with fully nested customer and survey data', () => {
    const fullResponse: SurveyResponse = {
      _id: 'resp_1',
      customer: { _id: 'cust_1', name: 'Alice Wonderland', email: 'alice@example.com' },
      survey: { _id: 'surv_1', title: 'Health Habits Survey' },
      submittedAt: '2026-10-15T00:00:00.000Z',
      metadata: { ipAddress: '127.0.0.1', userAgent: 'Chrome', source: 'direct' },
      submittedResponse: { score: 10 },
    };

    render(
      <table>
        <tbody>
          <SurveyResponseRow
            resp={fullResponse}
            formatDate={dummyFormatDate}
            onSelectResponse={vi.fn()}
            onDeleteResponse={vi.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Alice Wonderland')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Health Habits Survey')).toBeInTheDocument();
    expect(screen.getByText('15 Oct 2026')).toBeInTheDocument();
    expect(screen.getByText('direct')).toBeInTheDocument();
  });

  it('renders safely without crashing when customer and survey objects are undefined (regression test for undefined.name)', () => {
    const flatResponse: SurveyResponse = {
      _id: 'resp_flat',
      sessionId: 'sess_99',
      customerName: 'Bob Builder',
      customerEmail: 'bob@example.com',
      surveyTitle: 'Renovation Survey',
      createdAt: '2026-10-14T12:00:00.000Z',
    };

    render(
      <table>
        <tbody>
          <SurveyResponseRow
            resp={flatResponse}
            formatDate={dummyFormatDate}
            onSelectResponse={vi.fn()}
            onDeleteResponse={vi.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Bob Builder')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('Renovation Survey')).toBeInTheDocument();
    expect(screen.getByText('15 Oct 2026')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument(); // fallback default source
  });

  it('falls back to Anonymous Customer and placeholders when fields are completely missing', () => {
    const bareResponse: SurveyResponse = {
      _id: 'resp_empty',
    };

    render(
      <table>
        <tbody>
          <SurveyResponseRow
            resp={bareResponse}
            formatDate={dummyFormatDate}
            onSelectResponse={vi.fn()}
            onDeleteResponse={vi.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Anonymous Customer')).toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('triggers onSelectResponse and onDeleteResponse handlers', () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();
    window.confirm = vi.fn().mockReturnValue(true);

    const resp: SurveyResponse = {
      _id: 'resp_action',
      sessionId: 'sess_action',
      customerName: 'Charlie Brown',
      surveyId: 'survey_123',
    };

    render(
      <table>
        <tbody>
          <SurveyResponseRow
            resp={resp}
            surveyId="survey_123"
            formatDate={dummyFormatDate}
            onSelectResponse={onSelect}
            onDeleteResponse={onDelete}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByTitle('View response'));
    expect(onSelect).toHaveBeenCalledWith(resp);

    fireEvent.click(screen.getByTitle('Delete response'));
    expect(onDelete).toHaveBeenCalledWith('sess_action');
  });
});
