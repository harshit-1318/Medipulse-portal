import { describe, it, expect } from 'vitest';
import { getRoleBadgeConfig } from '../utils/roleConfig';

describe('getRoleBadgeConfig', () => {
  it('returns super admin styling when isSuper is true', () => {
    const config = getRoleBadgeConfig('admin', true);
    expect(config.label).toBe('Super Admin');
    expect(config.textClass).toBe('text-purple-700');
    expect(config.iconName).toBe('Crown');
  });

  it('returns doctor styling for doctor and prescriber roles', () => {
    const doctorConfig = getRoleBadgeConfig('doctor');
    expect(doctorConfig.label).toBe('Doctor');
    expect(doctorConfig.textClass).toBe('text-[#00a294]');
    expect(doctorConfig.iconName).toBe('Stethoscope');

    const prescriberConfig = getRoleBadgeConfig('prescriber');
    expect(prescriberConfig.label).toBe('Doctor / Prescriber');
    expect(prescriberConfig.iconName).toBe('Stethoscope');
  });

  it('returns nurse styling for nurse role', () => {
    const config = getRoleBadgeConfig('nurse');
    expect(config.label).toBe('Nurse');
    expect(config.textClass).toBe('text-emerald-700');
    expect(config.iconName).toBe('HeartPulse');
  });

  it('returns receptionist styling for receptionist role', () => {
    const config = getRoleBadgeConfig('receptionist');
    expect(config.label).toBe('Receptionist');
    expect(config.textClass).toBe('text-sky-700');
    expect(config.iconName).toBe('Headphones');
  });

  it('returns accountant styling for accountant role', () => {
    const config = getRoleBadgeConfig('accountant');
    expect(config.label).toBe('Accountant');
    expect(config.textClass).toBe('text-amber-700');
    expect(config.iconName).toBe('Coins');
  });

  it('returns patient styling for patient role', () => {
    const config = getRoleBadgeConfig('patient');
    expect(config.label).toBe('Patient');
    expect(config.textClass).toBe('text-slate-700');
    expect(config.iconName).toBe('User');
  });

  it('returns fallback styling for unknown role', () => {
    const config = getRoleBadgeConfig('auditor');
    expect(config.label).toBe('Auditor');
    expect(config.textClass).toBe('text-slate-600');
    expect(config.iconName).toBe('User');
  });
});
