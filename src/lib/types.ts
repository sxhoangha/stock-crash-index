export interface MarketData {
  date: string;
  value: number;
}

export interface MarketIndexData {
  sp500: MarketData[];
  vix: MarketData[];
}

export interface MacroIndicators {
  cpiData: MarketData[]; // Array of CPI values over time
  inflationData: MarketData[]; // Array of Inflation (PCEPI) values over time
  unemploymentData: MarketData[]; // Array of unemployment rate values over time
  bondYieldData: MarketData[]; // Array of 10-year Treasury yield values over time
  gdpData: MarketData[]; // Array of GDP growth rate values over time
  consumerConfidenceData: MarketData[]; // Array of Consumer Confidence Index values over time
  totalDebtData: MarketData[]; // Array of Federal Debt: Total Public Debt values over time
  debtToGdpData: MarketData[]; // Array of Federal Debt as % of GDP values over time
  yieldCurveData: MarketData[]; // Array of 10Y-2Y Treasury spread values over time
  joblessClaimsData: MarketData[]; // Array of Initial Jobless Claims values over time
  currentShillerPE: number | null; // Current Shiller CAPE Ratio value
  fedFundsRateData: MarketData[]; // Array of Federal Funds Rate values over time
  creditSpreadData: MarketData[]; // Array of High Yield Credit Spread values over time
}

export interface CrashScore {
  score: number;
  risk: 'Low' | 'Moderate' | 'High';
  factors: string[];
}

export interface CrashIndex {
  score: number; // 0-100
  risk: 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Extreme';
  breakdown: {
    leadingIndicators: number; // max 40
    concurrentIndicators: number; // max 35
    laggingIndicators: number; // max 25
  };
  factors: string[];
  timestamp: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High';
export type CrashIndexRiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Extreme';

export const riskColors: Record<RiskLevel, string> = {
  Low: '#4caf50',
  Moderate: '#ff9800',
  High: '#f44336',
};

export const crashIndexColors: Record<CrashIndexRiskLevel, string> = {
  Low: '#4caf50', // Green
  Moderate: '#8bc34a', // Light Green
  Elevated: '#ff9800', // Orange
  High: '#ff5722', // Deep Orange
  Extreme: '#f44336', // Red
};
