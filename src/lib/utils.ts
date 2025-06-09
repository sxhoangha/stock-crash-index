import { CrashScore } from './types';

export function calculateCrashScore(
  vix: number,
  sp500Change7d: number,
  sp500Change30d: number,
  cpi: number,
  unemployment: number,
  bondYield: number
): CrashScore {
  let score = 0;
  const factors: string[] = [];

  // VIX-based factors
  if (vix > 30) {
    score += 3;
    factors.push('VIX above 30');
  } else if (vix > 20) {
    score += 2;
    factors.push('VIX above 20');
  }

  // S&P 500 drops
  if (sp500Change7d < -5) {
    score += 2;
    factors.push('S&P 500 dropped >5% in 7 days');
  }
  if (sp500Change30d < -10) {
    score += 2;
    factors.push('S&P 500 dropped >10% in 30 days');
  }

  // Macro indicators
  if (cpi > 4) {
    score += 1;
    factors.push('High inflation (CPI > 4%)');
  }
  if (unemployment > 6) {
    score += 1;
    factors.push('High unemployment (>6%)');
  }
  if (bondYield > 5) {
    score += 1;
    factors.push('High bond yields (>5%)');
  }

  // Cap score at 10
  score = Math.min(10, score);

  // Determine risk level
  let risk: 'Low' | 'Moderate' | 'High';
  if (score <= 3) {
    risk = 'Low';
  } else if (score <= 6) {
    risk = 'Moderate';
  } else {
    risk = 'High';
  }

  return { score, risk, factors };
}

export function formatNumber(num: number | undefined | null, decimals = 2): string {
  if (num === undefined || num === null || typeof num !== 'number' || isNaN(num)) {
    return 'N/A';
  }
  return num.toFixed(decimals);
}

export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  return ((newValue - oldValue) / oldValue) * 100;
}
