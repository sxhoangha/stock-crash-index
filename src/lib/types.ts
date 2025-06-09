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
}

export interface CrashScore {
  score: number;
  risk: 'Low' | 'Moderate' | 'High';
  factors: string[];
}

export type RiskLevel = 'Low' | 'Moderate' | 'High';

export const riskColors: Record<RiskLevel, string> = {
  Low: '#4caf50',
  Moderate: '#ff9800',
  High: '#f44336',
};
