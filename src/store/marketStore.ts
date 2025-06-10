import { create } from 'zustand';
import { MacroIndicators, MarketData, CrashScore } from '@/lib/types';

interface MarketState {
  sp500Data: MarketData[];
  vixData: MarketData[];
  macroIndicators: MacroIndicators;
  crashScore: CrashScore;
  fetchMarketData: () => Promise<void>;
  fetchMacroIndicators: () => Promise<void>;
  calculateAndUpdateCrashScore: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  sp500Data: [],
  vixData: [],
  macroIndicators: {
    cpiData: [],
    inflationData: [],
    unemploymentData: [],
    bondYieldData: [],
    gdpData: [],
    consumerConfidenceData: [],
    totalDebtData: [],
    debtToGdpData: [],
  },
  crashScore: {
    score: 0,
    risk: 'Low',
    factors: [],
  },
  fetchMarketData: async () => {
    try {
      const [sp500Response, vixResponse] = await Promise.all([
        fetch('/api/market/sp500'),
        fetch('/api/market/vix'),
      ]);
      const sp500Data = await sp500Response.json();
      const vixData = await vixResponse.json();
      set({ sp500Data, vixData });
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  },
  fetchMacroIndicators: async () => {
    try {
      const response = await fetch('/api/macro');
      const macroIndicators = await response.json();
      set({ macroIndicators });
    } catch (error) {
      console.error('Failed to fetch macro indicators:', error);
    }
  },
  calculateAndUpdateCrashScore: () => {
    // This will be implemented later using the calculateCrashScore utility
  },
}));
