'use client';
import { useEffect } from 'react';
import { Container, Grid, Box } from '@mui/material';
import ThemeRegistry from './ThemeRegistry';
import { MarketIndexes } from '@/components/MarketIndexes';
import { MacroIndicatorsComponent } from '@/components/MacroIndicators';
import { CrashScoreComponent } from '@/components/CrashScore';
import { useMarketStore } from '@/store/marketStore';

export default function HomePage() {
  const { sp500Data, vixData, macroIndicators, crashScore, fetchMarketData, fetchMacroIndicators } =
    useMarketStore();

  useEffect(() => {
    fetchMarketData();
    fetchMacroIndicators();

    const interval = setInterval(() => {
      fetchMarketData();
      fetchMacroIndicators();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [fetchMarketData, fetchMacroIndicators]);
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: 4,
        backgroundColor: 'background.default',
      }}
    >
      {' '}
      <Container maxWidth="xl">
        {' '}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* First row - Crash Score */}
          <Box>
            <CrashScoreComponent data={crashScore} macroIndicators={macroIndicators} />
          </Box>

          {/* Second row - Macro Indicators */}
          <Box>
            <MacroIndicatorsComponent data={macroIndicators} />
          </Box>

          {/* Third row - Market Indexes */}
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
              },
            }}
          >
            <MarketIndexes data={sp500Data} title="S&P 500" color="#2196f3" />
            <MarketIndexes data={vixData} title="VIX" color="#f50057" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
