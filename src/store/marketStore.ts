import { create } from 'zustand';
import { MacroIndicators, MarketData, CrashScore, CrashIndex } from '@/lib/types';
import { calculateCrashIndex, calculatePercentageChange } from '@/lib/utils';

interface MarketState {
  sp500Data: MarketData[];
  vixData: MarketData[];
  macroIndicators: MacroIndicators;
  crashScore: CrashScore;
  crashIndex: CrashIndex | null;
  fetchMarketData: () => Promise<void>;
  fetchMacroIndicators: () => Promise<void>;
  calculateAndUpdateCrashIndex: () => void;
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
    yieldCurveData: [],
    joblessClaimsData: [],
    currentShillerPE: null,
    fedFundsRateData: [],
    creditSpreadData: [],
  },
  crashScore: {
    score: 0,
    risk: 'Low',
    factors: [],
  },
  crashIndex: null,
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
  calculateAndUpdateCrashIndex: () => {
    const state = get();
    const { sp500Data, vixData, macroIndicators } = state;

    // Helper function to get latest value safely
    const getLatest = (data: MarketData[] | undefined, fallback: number): number => {
      return data && data.length > 0 ? data[data.length - 1].value : fallback;
    };

    // Calculate S&P 500 changes
    const sp500Latest = getLatest(sp500Data, 0);
    const sp500_7daysAgo =
      sp500Data && sp500Data.length >= 7 ? sp500Data[sp500Data.length - 7].value : sp500Latest;
    const sp500_30daysAgo =
      sp500Data && sp500Data.length >= 30 ? sp500Data[sp500Data.length - 30].value : sp500Latest;

    const sp500Change7d = calculatePercentageChange(sp500_7daysAgo, sp500Latest);
    const sp500Change30d = calculatePercentageChange(sp500_30daysAgo, sp500Latest);

    // Calculate crash index
    const crashIndex = calculateCrashIndex({
      vix: getLatest(vixData, 15),
      sp500Change7d,
      sp500Change30d,
      cpi: getLatest(macroIndicators.cpiData, 2.5),
      unemployment: getLatest(macroIndicators.unemploymentData, 4.0),
      gdpGrowth: getLatest(macroIndicators.gdpData, 2.0),
      consumerConfidence: getLatest(macroIndicators.consumerConfidenceData, 95),
      bondYield: getLatest(macroIndicators.bondYieldData, 4.0),
      yieldCurve: getLatest(macroIndicators.yieldCurveData, 0.5),
      joblessClaims: getLatest(macroIndicators.joblessClaimsData, 220000),
      shillerPE: macroIndicators.currentShillerPE,
      fedFundsRate: getLatest(macroIndicators.fedFundsRateData, 4.5),
      creditSpread: getLatest(macroIndicators.creditSpreadData, 350),
    });

    set({ crashIndex });
  },
}));
