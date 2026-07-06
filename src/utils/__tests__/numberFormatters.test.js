import { describe, it, expect } from 'vitest';
import { parseQuantity, formatNumber } from '../../utils/numberFormatters';

describe('parseQuantity', () => {
  // Whole numbers
  it('parses plain integers', () => expect(parseQuantity('100')).toBe(100));
  it('parses decimals', () => expect(parseQuantity('1.5')).toBe(1.5));

  // k suffix
  it('parses 1k as 1000', () => expect(parseQuantity('1k')).toBe(1000));
  it('parses 1.5k as 1500', () => expect(parseQuantity('1.5k')).toBe(1500));
  it('parses 100k as 100000', () => expect(parseQuantity('100k')).toBe(100000));
  it('parses K uppercase', () => expect(parseQuantity('2K')).toBe(2000));

  // m suffix
  it('parses 1m as 1000000', () => expect(parseQuantity('1m')).toBe(1_000_000));
  it('parses 2.5m', () => expect(parseQuantity('2.5m')).toBe(2_500_000));

  // b suffix
  it('parses 1b as 1000000000', () => expect(parseQuantity('1b')).toBe(1_000_000_000));

  // t suffix
  it('parses 1t as 1 trillion', () => expect(parseQuantity('1t')).toBe(1_000_000_000_000));

  // Edge cases
  it('returns NaN for empty string', () => expect(parseQuantity('')).toBeNaN());
  it('returns NaN for letters only', () => expect(parseQuantity('abc')).toBeNaN());
  it('returns NaN for invalid mixed', () => expect(parseQuantity('1.2.3')).toBeNaN());
  it('handles number type passthrough', () => expect(parseQuantity(50)).toBe(50));
  it('handles 0', () => expect(parseQuantity('0')).toBe(0));
  it('handles spaces around value', () => expect(parseQuantity(' 1k ')).toBe(1000));
});

describe('formatNumber', () => {
  it('formats 0', () => expect(formatNumber(0)).toBe('0'));
  it('formats small integer', () => expect(formatNumber(100)).toBe('100'));
  it('formats decimal', () => expect(formatNumber(10.5)).toBe('10.5'));
  it('formats 1000 as 1k', () => expect(formatNumber(1000)).toBe('1k'));
  it('formats 1500 as 1.5k', () => expect(formatNumber(1500)).toBe('1.5k'));
  it('formats 10000 as 10k', () => expect(formatNumber(10000)).toBe('10k'));
  it('formats 100000 as 100k', () => expect(formatNumber(100000)).toBe('100k'));
  it('formats 1000000 as 1M', () => expect(formatNumber(1_000_000)).toBe('1M'));
  it('formats 1500000 as 1.5M', () => expect(formatNumber(1_500_000)).toBe('1.5M'));
  it('formats 1000000000 as 1B', () => expect(formatNumber(1_000_000_000)).toBe('1B'));
  it('formats 1000000000000 as 1T', () => expect(formatNumber(1_000_000_000_000)).toBe('1T'));
  it('handles NaN', () => expect(formatNumber(NaN)).toBe('0'));
  it('handles null', () => expect(formatNumber(null)).toBe('0'));
  it('handles negative numbers', () => expect(formatNumber(-1500)).toBe('-1.5k'));
  // Ensures no suffix collision — 1.5k stays 1.5k, not 1.5kg/1.5kk
  it('does not append extra suffix chars', () => {
    const result = formatNumber(1500);
    expect(result).toBe('1.5k');
    expect(result.endsWith('kk')).toBe(false);
    expect(result.endsWith('kg')).toBe(false);
  });
});
