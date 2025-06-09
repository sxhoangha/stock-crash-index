'use client';

import { MacroIndicators } from '@/lib/types';
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { BondYieldChart } from './BondYieldChart';
import { CPIChart } from './CPIChart';
import { UnemploymentChart } from './UnemploymentChart';
import { GDPChart } from './GDPChart';
import { ConsumerConfidenceChart } from './ConsumerConfidenceChart';

interface MacroIndicatorsProps {
  data: MacroIndicators;
}

export const MacroIndicatorsComponent: React.FC<MacroIndicatorsProps> = ({ data }) => {
  const isLoading =
    !data || Object.values(data).every(arr => !Array.isArray(arr) || arr.length === 0);

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading economic indicators...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 3,
        }}
      >
        {/* First row */}
        <Box>
          <CPIChart data={data?.cpiData ?? []} inflationData={data?.inflationData ?? []} />
        </Box>
        <Box>
          <BondYieldChart data={data?.bondYieldData ?? []} />
        </Box>
        {/* Second row (GDP and Consumer Confidence) */}
        <Box>
          <GDPChart data={data?.gdpData ?? []} />
        </Box>
        <Box>
          <ConsumerConfidenceChart data={data?.consumerConfidenceData ?? []} />
        </Box>
        {/* Third row (moved from second row) */}
        <Box>
          <UnemploymentChart data={data?.unemploymentData ?? []} />
        </Box>
      </Box>
    </Box>
  );
};
