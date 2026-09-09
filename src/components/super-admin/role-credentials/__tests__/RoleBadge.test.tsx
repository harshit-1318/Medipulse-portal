import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RoleBadge } from '../components/RoleBadge';

describe('RoleBadge Component', () => {
  it('renders Super Admin badge with purple styling', () => {
    render(<RoleBadge role="admin" isSuper={true} />);
    const badge = screen.getByTestId('role-badge');
    expect(badge).toHaveTextContent('Super Admin');
    expect(badge.className).toContain('text-purple-700');
  });

  it('renders Doctor badge with teal styling', () => {
    render(<RoleBadge role="doctor" />);
    const badge = screen.getByTestId('role-badge');
    expect(badge).toHaveTextContent('Doctor');
    expect(badge.className).toContain('text-[#00a294]');
  });

  it('renders Nurse badge with emerald styling', () => {
    render(<RoleBadge role="nurse" />);
    const badge = screen.getByTestId('role-badge');
    expect(badge).toHaveTextContent('Nurse');
    expect(badge.className).toContain('text-emerald-700');
  });

  it('renders Accountant badge with amber styling', () => {
    render(<RoleBadge role="accountant" />);
    const badge = screen.getByTestId('role-badge');
    expect(badge).toHaveTextContent('Accountant');
    expect(badge.className).toContain('text-amber-700');
  });
});
