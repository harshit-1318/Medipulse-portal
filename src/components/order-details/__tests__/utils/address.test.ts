import { describe, it, expect } from 'vitest';
import { formatAddress, cleanAddress, capitalizeName } from '../../utils/address';

describe('Address Utilities', () => {
    describe('formatAddress', () => {
        it('should format a valid address object', () => {
            const addr = {
                address1: '123 Main St',
                address2: 'Suite 4',
                city: 'London',
                zip: 'SW1A 1AA',
                country: 'UK',
                first_name: '', last_name: '', province: '', phone: ''
            };
            expect(formatAddress(addr)).toBe('123 Main St, Suite 4, London, UK, SW1A 1AA');
        });

        it('should filter out null or undefined parts', () => {
            const addr: any = {
                address1: '123 Main St',
                city: 'London',
                zip: 'null',
                country: undefined
            };
            expect(formatAddress(addr)).toBe('123 Main St, London');
        });

        it('should return null if no address provided', () => {
            expect(formatAddress(null as any)).toBe(null);
        });
    });

    describe('cleanAddress', () => {
        it('should remove customer name from address string', () => {
            const addr = 'John Doe, 123 Main St, London';
            expect(cleanAddress(addr, 'John Doe')).toBe('123 Main St, London');
        });

        it('should remove long IDs and phone numbers', () => {
            const addr = '123456789012345, +441234567890, 123 Main St';
            expect(cleanAddress(addr, 'John Doe')).toBe('123 Main St');
        });

        it('should remove "null" or "undefined" strings', () => {
            const addr = '123 Main St, null, London, undefined';
            expect(cleanAddress(addr, 'John Doe')).toBe('123 Main St, London');
        });

        it('should handle empty input', () => {
            expect(cleanAddress('', 'John Doe')).toBe('-');
        });
    });

    describe('capitalizeName', () => {
        it('should capitalize multiple names correctly', () => {
            expect(capitalizeName('john doe')).toBe('John Doe');
            expect(capitalizeName('JANE SMITH')).toBe('Jane Smith');
            expect(capitalizeName('alan turing-test')).toBe('Alan Turing-test');
        });
    });
});
