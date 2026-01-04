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

    // Helper function to get latest value - returns null if no data
    const getLatest = (data: MarketData[] | undefined): number | null => {
      return data && data.length > 0 ? data[data.length - 1].value : null;
    };

    // Check if we have all required data before calculating
    // Don't use fallback values - wait for real data
    const vix = getLatest(vixData);
    const sp500Latest = getLatest(sp500Data);
    const cpi = getLatest(macroIndicators.cpiData);
    const unemployment = getLatest(macroIndicators.unemploymentData);
    const gdpGrowth = getLatest(macroIndicators.gdpData);
    const consumerConfidence = getLatest(macroIndicators.consumerConfidenceData);
    const bondYield = getLatest(macroIndicators.bondYieldData);
    const yieldCurve = getLatest(macroIndicators.yieldCurveData);
    const joblessClaims = getLatest(macroIndicators.joblessClaimsData);
    const fedFundsRate = getLatest(macroIndicators.fedFundsRateData);
    const creditSpread = getLatest(macroIndicators.creditSpreadData);

    // If any critical data is missing, don't calculate - keep showing spinner
    if (
      vix === null ||
      sp500Latest === null ||
      cpi === null ||
      unemployment === null ||
      gdpGrowth === null ||
      consumerConfidence === null ||
      bondYield === null ||
      yieldCurve === null ||
      joblessClaims === null ||
      fedFundsRate === null ||
      creditSpread === null
    ) {
      return;
    }

    // Calculate S&P 500 changes
    const sp500_7daysAgo =
      sp500Data && sp500Data.length >= 7 ? sp500Data[sp500Data.length - 7].value : sp500Latest;
    const sp500_30daysAgo =
      sp500Data && sp500Data.length >= 30 ? sp500Data[sp500Data.length - 30].value : sp500Latest;

    const sp500Change7d = calculatePercentageChange(sp500_7daysAgo, sp500Latest);
    const sp500Change30d = calculatePercentageChange(sp500_30daysAgo, sp500Latest);

    // Calculate crash index with real data only
    const crashIndex = calculateCrashIndex({
      vix,
      sp500Change7d,
      sp500Change30d,
      cpi,
      unemployment,
      gdpGrowth,
      consumerConfidence,
      bondYield,
      yieldCurve,
      joblessClaims,
      shillerPE: macroIndicators.currentShillerPE ?? undefined,
      fedFundsRate,
      creditSpread,
    });

    set({ crashIndex });
  },
}));
