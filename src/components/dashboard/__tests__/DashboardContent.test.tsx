import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardContent from '../DashboardContent';
import { useDashboardData } from '../hooks/useDashboardData';

vi.mock('../hooks/useDashboardData', () => ({ useDashboardData: vi.fn() }));
vi.mock('@/store', () => ({
  useUserInfo: vi.fn(),
  useSiteInfo: vi.fn(() => ({ read_only: false })),
  initializeSite: vi.fn(),
}));
vi.mock('../components/DashboardHeader', () => ({
  DashboardHeader: () => <div data-testid="dashboard-header">Header</div>,
}));
vi.mock('../components/StatCardsSection', () => ({
  StatCardsSection: () => <div data-testid="stat-cards-section">Stats</div>,
}));
vi.mock('../../orders-table', () => ({
  default: () => <div data-testid="order-table">Order Table</div>,
}));
vi.mock('@/components/common/QueryProvider', () => ({
  QueryProvider: ({ children }: any) => <>{children}</>,
}));

const mockData = (role: string, canViewClinicalOrders: boolean, extra: any = {}) => ({
  role,
  canViewClinicalOrders,
  stats: null,
  orders: [],
  page: 1,
  setPage: vi.fn(),
  total: 0,
  loading: false,
  filters: {} as any,
  setFilters: vi.fn(),
  ...extra,
});

describe('DashboardContent Role Separation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders customer portal view for customer role', () => {
    vi.mocked(useDashboardData).mockReturnValue(mockData('customer', false) as any);
    render(<DashboardContent />);
    expect(screen.getByText(/Manage your prescriptions, consultations/i)).toBeInTheDocument();
    expect(screen.queryByTestId('stat-cards-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-table')).not.toBeInTheDocument();
  });

  it('renders logistics view for driver role', () => {
    vi.mocked(useDashboardData).mockReturnValue(mockData('driver', false) as any);
    render(<DashboardContent />);
    expect(screen.getByText(/Logistics & Deliveries Portal/i)).toBeInTheDocument();
    expect(screen.queryByTestId('stat-cards-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-table')).not.toBeInTheDocument();
  });

  it('renders clinical order table and stat cards for admin and clinical roles', () => {
    vi.mocked(useDashboardData).mockReturnValue(
      mockData('admin', true, { stats: { totalOrders: 10 }, orders: [{ id: '1' }], total: 1 }) as any
    );
    render(<DashboardContent />);
    expect(screen.getByTestId('stat-cards-section')).toBeInTheDocument();
    expect(screen.getByTestId('order-table')).toBeInTheDocument();
    expect(screen.queryByText(/Manage your prescriptions, consultations/i)).not.toBeInTheDocument();
  });
});
