import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from '../components/ThemeToggle';

vi.mock('lucide-react', () => ({
    Sun: () => <span data-testid="sun-icon">Sun</span>,
    Moon: () => <span data-testid="moon-icon">Moon</span>,
}));

describe('ThemeToggle', () => {
    it('renders Light Mode option when isDark is true', () => {
        const handleToggle = vi.fn();
        render(<ThemeToggle isDark={true} onToggle={handleToggle} />);

        expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeInTheDocument();
        expect(screen.getByText('Light Mode')).toBeInTheDocument();
    });

    it('renders Dark Mode option when isDark is false', () => {
        const handleToggle = vi.fn();
        render(<ThemeToggle isDark={false} onToggle={handleToggle} />);

        expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument();
        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('triggers onToggle callback when clicked', () => {
        const handleToggle = vi.fn();
        render(<ThemeToggle isDark={true} onToggle={handleToggle} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleToggle).toHaveBeenCalledTimes(1);
    });
});
