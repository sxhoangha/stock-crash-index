import { CrashScore, CrashIndex } from './types';

export function calculateCrashScore(
  vix: number,
  sp500Change7d: number,
  sp500Change30d: number,
  cpi: number,
  unemployment: number,
  bondYield: number,
  yieldCurve?: number,
  joblessClaims?: number,
  shillerPE?: number,
  fedFundsRate?: number,
  creditSpread?: number
): CrashScore {
  let score = 0;
  const factors: string[] = [];

  // VIX-based factors
  if (vix > 30) {
    score += 3;
    factors.push('VIX above 30 (extreme fear)');
  } else if (vix > 20) {
    score += 2;
    factors.push('VIX above 20 (elevated volatility)');
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

  // New indicators
  if (yieldCurve !== undefined) {
    if (yieldCurve < -0.5) {
      score += 3;
      factors.push('Yield curve deeply inverted (<-0.5%)');
    } else if (yieldCurve < 0) {
      score += 2;
      factors.push('Yield curve inverted (recession signal)');
    }
  }

  if (joblessClaims !== undefined && joblessClaims > 350000) {
    score += 2;
    factors.push('Jobless claims >350K (labor market stress)');
  } else if (joblessClaims !== undefined && joblessClaims > 250000) {
    score += 1;
    factors.push('Jobless claims elevated (>250K)');
  }

  if (shillerPE !== undefined && shillerPE > 35) {
    score += 2;
    factors.push('Shiller P/E >35 (overvalued market)');
  } else if (shillerPE !== undefined && shillerPE > 30) {
    score += 1;
    factors.push('Shiller P/E >30 (elevated valuations)');
  }

  if (fedFundsRate !== undefined && fedFundsRate > 5) {
    score += 2;
    factors.push('Fed Funds Rate >5% (restrictive policy)');
  } else if (fedFundsRate !== undefined && fedFundsRate > 4) {
    score += 1;
    factors.push('Fed Funds Rate >4% (tight policy)');
  }

  if (creditSpread !== undefined && creditSpread > 600) {
    score += 3;
    factors.push('Credit spreads >600bps (credit crisis)');
  } else if (creditSpread !== undefined && creditSpread > 400) {
    score += 2;
    factors.push('Credit spreads >400bps (credit stress)');
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

export function calculateCrashIndex(indicators: {
  // Market indicators
  vix: number;
  sp500Change7d: number;
  sp500Change30d: number;

  // Macro indicators
  cpi: number;
  unemployment: number;
  gdpGrowth: number;
  consumerConfidence: number;
  bondYield: number;

  // New advanced indicators
  yieldCurve?: number;
  joblessClaims?: number;
  shillerPE?: number;
  fedFundsRate?: number;
  creditSpread?: number;
}): CrashIndex {
  let leading = 0;
  let concurrent = 0;
  let lagging = 0;
  const factors: string[] = [];

  // ============================================
  // TIER 1: LEADING INDICATORS (40 points max)
  // ============================================

  // Yield Curve (15 pts) - Most reliable recession predictor
  if (indicators.yieldCurve !== undefined) {
    if (indicators.yieldCurve < -0.5) {
      leading += 15;
      factors.push(`Yield curve deeply inverted (${indicators.yieldCurve.toFixed(2)}%)`);
    } else if (indicators.yieldCurve < 0) {
      leading += 7.5;
      factors.push(`Yield curve inverted (${indicators.yieldCurve.toFixed(2)}%)`);
    } else if (indicators.yieldCurve < 0.5) {
      leading += 3.75;
      factors.push('Yield curve flattening');
    }
  }

  // Credit Spreads (15 pts) - Credit market stress indicator
  if (indicators.creditSpread !== undefined) {
    if (indicators.creditSpread > 600) {
      leading += 15;
      factors.push(`Credit spreads ${indicators.creditSpread.toFixed(0)} bps (crisis level)`);
    } else if (indicators.creditSpread > 400) {
      leading += 7.5;
      factors.push(`Credit spreads ${indicators.creditSpread.toFixed(0)} bps (stress)`);
    }
  }

  // Shiller P/E (10 pts) - Market valuation
  if (indicators.shillerPE !== undefined) {
    if (indicators.shillerPE > 35) {
      leading += 10;
      factors.push(`Shiller P/E ${indicators.shillerPE.toFixed(1)} (bubble territory)`);
    } else if (indicators.shillerPE > 30) {
      leading += 5;
      factors.push(`Shiller P/E ${indicators.shillerPE.toFixed(1)} (elevated)`);
    } else if (indicators.shillerPE > 25) {
      leading += 2.5;
      factors.push(`Shiller P/E ${indicators.shillerPE.toFixed(1)} (above average)`);
    }
  }

  // ================================================
  // TIER 2: CONCURRENT INDICATORS (35 points max)
  // ================================================

  // VIX (12 pts) - Market fear gauge
  if (indicators.vix > 40) {
    concurrent += 12;
    factors.push(`VIX ${indicators.vix.toFixed(1)} (panic)`);
  } else if (indicators.vix > 30) {
    concurrent += 9;
    factors.push(`VIX ${indicators.vix.toFixed(1)} (extreme fear)`);
  } else if (indicators.vix > 20) {
    concurrent += 4;
    factors.push(`VIX ${indicators.vix.toFixed(1)} (elevated)`);
  }

  // Fed Funds Rate (10 pts) - Monetary policy stance
  if (indicators.fedFundsRate !== undefined) {
    if (indicators.fedFundsRate > 5.5) {
      concurrent += 10;
      factors.push(`Fed Funds ${indicators.fedFundsRate.toFixed(2)}% (very restrictive)`);
    } else if (indicators.fedFundsRate > 5) {
      concurrent += 7;
      factors.push(`Fed Funds ${indicators.fedFundsRate.toFixed(2)}% (restrictive)`);
    } else if (indicators.fedFundsRate > 4) {
      concurrent += 5;
      factors.push(`Fed Funds ${indicators.fedFundsRate.toFixed(2)}% (tight)`);
    }
  }

  // Jobless Claims (8 pts) - Real-time labor indicator
  if (indicators.joblessClaims !== undefined) {
    if (indicators.joblessClaims > 400000) {
      concurrent += 8;
      factors.push(`Jobless claims ${(indicators.joblessClaims / 1000).toFixed(0)}K (severe)`);
    } else if (indicators.joblessClaims > 300000) {
      concurrent += 4;
      factors.push(`Jobless claims ${(indicators.joblessClaims / 1000).toFixed(0)}K (elevated)`);
    }
  }

  // CPI (5 pts) - Inflation pressure
  if (indicators.cpi > 5) {
    concurrent += 5;
    factors.push(`CPI ${indicators.cpi.toFixed(1)}% (high inflation)`);
  } else if (indicators.cpi > 4) {
    concurrent += 2.5;
    factors.push(`CPI ${indicators.cpi.toFixed(1)}% (elevated)`);
  }

  // ================================================
  // TIER 3: LAGGING INDICATORS (25 points max)
  // ================================================

  // S&P 500 Decline (10 pts) - Market drawdown
  if (indicators.sp500Change30d < -20) {
    lagging += 10;
    factors.push(`S&P 500 ${indicators.sp500Change30d.toFixed(1)}% (bear market)`);
  } else if (indicators.sp500Change30d < -10) {
    lagging += 7;
    factors.push(`S&P 500 ${indicators.sp500Change30d.toFixed(1)}% (correction)`);
  } else if (indicators.sp500Change7d < -5) {
    lagging += 4;
    factors.push(`S&P 500 ${indicators.sp500Change7d.toFixed(1)}% 7-day drop`);
  }

  // Unemployment (8 pts) - Labor market weakness
  if (indicators.unemployment > 6) {
    lagging += 8;
    factors.push(`Unemployment ${indicators.unemployment.toFixed(1)}% (high)`);
  } else if (indicators.unemployment > 5.5) {
    lagging += 4;
    factors.push(`Unemployment ${indicators.unemployment.toFixed(1)}% (rising)`);
  }

  // GDP Growth (4 pts) - Economic growth
  if (indicators.gdpGrowth < 0) {
    lagging += 4;
    factors.push(`GDP ${indicators.gdpGrowth.toFixed(1)}% (recession)`);
  } else if (indicators.gdpGrowth < 1) {
    lagging += 2;
    factors.push(`GDP ${indicators.gdpGrowth.toFixed(1)}% (weak)`);
  }

  // Consumer Confidence (3 pts) - Sentiment
  if (indicators.consumerConfidence < 85) {
    lagging += 3;
    factors.push(`Consumer confidence ${indicators.consumerConfidence.toFixed(1)} (pessimistic)`);
  } else if (indicators.consumerConfidence < 95) {
    lagging += 1.5;
    factors.push(`Consumer confidence ${indicators.consumerConfidence.toFixed(1)} (weak)`);
  }

  // Calculate total score
  const score = Math.round(leading + concurrent + lagging);

  // Determine risk level
  let risk: 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Extreme';
  if (score <= 20) risk = 'Low';
  else if (score <= 40) risk = 'Moderate';
  else if (score <= 60) risk = 'Elevated';
  else if (score <= 80) risk = 'High';
  else risk = 'Extreme';

  return {
    score,
    risk,
    breakdown: {
      leadingIndicators: Math.round(leading * 10) / 10,
      concurrentIndicators: Math.round(concurrent * 10) / 10,
      laggingIndicators: Math.round(lagging * 10) / 10,
    },
    factors,
    timestamp: new Date().toISOString(),
  };
}
