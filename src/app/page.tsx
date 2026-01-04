'use client';
import { useEffect } from 'react';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ThemeRegistry from './ThemeRegistry';
import { MarketIndexes } from '@/components/MarketIndexes';
import { MacroIndicatorsComponent } from '@/components/MacroIndicators';
import { CrashScoreComponent } from '@/components/CrashScore';
import { CrashIndexDisplay } from '@/components/CrashIndexDisplay';
import { useMarketStore } from '@/store/marketStore';

export default function HomePage() {
  const {
    sp500Data,
    vixData,
    macroIndicators,
    crashScore,
    crashIndex,
    fetchMarketData,
    fetchMacroIndicators,
    calculateAndUpdateCrashIndex,
  } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
    fetchMacroIndicators();

    const interval = setInterval(() => {
      fetchMarketData();
      fetchMacroIndicators();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [fetchMarketData, fetchMacroIndicators]);

  // Calculate crash index when data changes
  useEffect(() => {
    if (sp500Data.length > 0 && vixData.length > 0) {
      calculateAndUpdateCrashIndex();
    }
  }, [sp500Data, vixData, macroIndicators, calculateAndUpdateCrashIndex]);
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: 4,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="xl">
        {/* Header with title and methodology link */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Market Crash Index Dashboard
          </Typography>
          <Link href="/methodology" passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<InfoOutlinedIcon />}
              sx={{ borderRadius: 2 }}
            >
              How It Works
            </Button>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* First row - Crash Index (NEW) */}
          <Box>
            <CrashIndexDisplay data={crashIndex} />
          </Box>

          {/* Second row - Individual Indicator Status */}
          <Box>
            <CrashScoreComponent data={crashScore} macroIndicators={macroIndicators} />
          </Box>

          {/* Third row - Macro Indicators */}
          <Box>
            <MacroIndicatorsComponent data={macroIndicators} />
          </Box>

          {/* Fourth row - Market Indexes */}
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
