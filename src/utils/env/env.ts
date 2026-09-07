type EnvValue = string | number | boolean | null | undefined;

const TRUTHY_ENV_VALUES = new Set(['true', '1', 'yes', 'on']);

export const normalizeEnvValue = (value: EnvValue): string => {
  return String(value ?? '').trim().toLowerCase();
};

export const getFirstDefinedEnvValue = (...values: EnvValue[]): EnvValue => {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
};

export const isTruthyEnvValue = (value: EnvValue): boolean => {
  return TRUTHY_ENV_VALUES.has(normalizeEnvValue(value));
};

export const isEnvFlagEnabled = (...values: EnvValue[]): boolean => {
  return isTruthyEnvValue(getFirstDefinedEnvValue(...values));
};

export const isDevEnvironment = (): boolean => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    return true;
  }
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
};

export const isLocalStorageDebugFlagEnabled = (localStorageKey: string, defaultInDev = false): boolean => {
  if (typeof window !== 'undefined') {
    try {
      const val = window.localStorage.getItem(localStorageKey);
      if (val !== null) {
        return isTruthyEnvValue(val);
      }
    } catch {
      // Fallback below
    }
  }
  return defaultInDev && isDevEnvironment();
};
