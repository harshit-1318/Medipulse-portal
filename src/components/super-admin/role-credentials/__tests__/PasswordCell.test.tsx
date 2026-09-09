import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PasswordCell } from '../components/PasswordCell';
import type { RoleCredentialUser } from '../types';

describe('PasswordCell Component', () => {
  const mockUser: RoleCredentialUser = {
    _id: 'u123',
    name: 'Dr. Watson',
    email: 'doctor@medipulse.io',
    role: 'doctor',
    is_active: true,
    is_super_admin: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: '2026-01-02T00:00:00.000Z',
    hasPassword: true,
    permissions: ['*'],
  };

  it('renders masked password by default with Show button', () => {
    const handleReveal = vi.fn();
    render(
      <PasswordCell
        user={mockUser}
        isRevealed={false}
        revealedPassword={null}
        secondsRemaining={0}
        onRequestReveal={handleReveal}
        onHide={vi.fn()}
        onCopy={vi.fn()}
      />
    );

    expect(screen.getByText('••••••••••')).toBeInTheDocument();
    const showBtn = screen.getByRole('button', { name: /show/i });
    expect(showBtn).toBeInTheDocument();

    fireEvent.click(showBtn);
    expect(handleReveal).toHaveBeenCalledWith(mockUser);
  });

  it('renders revealed password with timer, copy, and hide buttons when revealed', () => {
    const handleHide = vi.fn();
    const handleCopy = vi.fn();

    render(
      <PasswordCell
        user={mockUser}
        isRevealed={true}
        revealedPassword="SuperSecret123!"
        secondsRemaining={14}
        onRequestReveal={vi.fn()}
        onHide={handleHide}
        onCopy={handleCopy}
      />
    );

    expect(screen.getByText('SuperSecret123!')).toBeInTheDocument();
    expect(screen.getByText('14s')).toBeInTheDocument();

    const hideBtn = screen.getByTitle('Hide Password');
    fireEvent.click(hideBtn);
    expect(handleHide).toHaveBeenCalled();

    const copyBtn = screen.getByTitle('Copy Password');
    fireEvent.click(copyBtn);
    expect(handleCopy).toHaveBeenCalledWith('SuperSecret123!');
  });
});
