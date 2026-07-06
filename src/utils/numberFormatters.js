/**
 * Number formatting & parsing utilities for Recomp.
 * Extracted so they can be unit tested independently.
 */

/**
 * Parses a quantity string that may include shorthand suffixes:
 * k = thousands, m = millions, b = billions, t = trillions
 * Examples: '1.5k' → 1500, '1m' → 1000000, '100' → 100
 * @param {string|number} str
 * @returns {number} parsed value, or NaN if invalid
 */
export function parseQuantity(str) {
  if (typeof str === 'number') return str;
  if (typeof str !== 'string') return NaN;
  const s = str.trim().toLowerCase();
  if (s === '' || s === '.') return NaN;
  // \d+\.?\d* ensures only ONE decimal point is allowed (e.g. '1.2.3' won't match)
  const match = s.match(/^(\d+\.?\d*)\s*([kmbt]?)$/);
  if (!match) return NaN;
  let val = parseFloat(match[1]);
  if (isNaN(val)) return NaN;
  const suffix = match[2];
  if (suffix === 'k') val *= 1_000;
  else if (suffix === 'm') val *= 1_000_000;
  else if (suffix === 'b') val *= 1_000_000_000;
  else if (suffix === 't') val *= 1_000_000_000_000;
  return val;
}

/**
 * Formats a number into a compact human-readable string.
 * Examples: 1500 → '1.5k', 1000000 → '1M', 0.5 → '0.5'
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';
  if (num < 0) return '-' + formatNumber(-num);
  if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  // For small decimals, keep 1 decimal place only if needed
  return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(1)).toString();
}
