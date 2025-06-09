'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { CrashScore, MacroIndicators } from '@/lib/types';

interface IndicatorStatus {
  name: string;
  value: number;
  status: 'healthy' | 'caution' | 'warning';
}

interface CrashScoreProps {
  data: CrashScore;
  macroIndicators?: MacroIndicators;
}

const statusColors = {
  healthy: '#4caf50', // Green
  caution: '#ff9800', // Yellow
  warning: '#f44336', // Red
};

export const CrashScoreComponent: React.FC<CrashScoreProps> = ({ data, macroIndicators }) => {
  const normalizedValue = (data.score / 10) * 100;

  const getIndicatorStatus = (
    indicator: string,
    value: number
  ): 'healthy' | 'caution' | 'warning' => {
    switch (indicator) {
      case 'CPI YoY':
        if (value >= 1.5 && value <= 3) return 'healthy';
        if ((value > 3 && value <= 4) || (value >= 1 && value < 1.5)) return 'caution';
        return 'warning'; // >4% or <1%

      case '10Y Yield':
        if (value >= 2 && value <= 4) return 'healthy';
        if (value < 2 || (value > 4 && value <= 5)) return 'caution';
        return 'warning'; // >5% or <2Y

      case 'GDP Growth':
        if (value >= 1.5 && value <= 3.5) return 'healthy';
        if (value >= 0 && value < 1.5) return 'caution';
        return 'warning'; // <0% (negative)

      case 'Consumer Confidence':
        if (value > 100) return 'healthy';
        if (value >= 85 && value <= 100) return 'caution';
        return 'warning'; // <85

      case 'Unemployment':
        if (value >= 3.5 && value <= 5) return 'healthy';
        if (value > 5 && value <= 5.5) return 'caution';
        return 'warning'; // >5.5% or sharp rise

      default:
        return 'caution';
    }
  };
  const getIndicators = (): IndicatorStatus[] => {
    if (!macroIndicators) {
      console.log('No macroIndicators prop provided');
      return [];
    }

    // Add fallback test data if the API data is empty
    const testMacroIndicators = {
      cpiData:
        macroIndicators.cpiData.length > 0
          ? macroIndicators.cpiData
          : [{ date: '2024-12-01', value: 2.8 }],
      bondYieldData:
        macroIndicators.bondYieldData.length > 0
          ? macroIndicators.bondYieldData
          : [{ date: '2024-12-01', value: 4.2 }],
      gdpData:
        macroIndicators.gdpData.length > 0
          ? macroIndicators.gdpData
          : [{ date: '2024-12-01', value: 2.1 }],
      consumerConfidenceData:
        macroIndicators.consumerConfidenceData.length > 0
          ? macroIndicators.consumerConfidenceData
          : [{ date: '2024-12-01', value: 95.0 }],
      unemploymentData:
        macroIndicators.unemploymentData.length > 0
          ? macroIndicators.unemploymentData
          : [{ date: '2024-12-01', value: 4.2 }],
    };

    const indicators: IndicatorStatus[] = [];

    // CPI (using latest value)
    if (testMacroIndicators.cpiData.length > 0) {
      const latestCPI = testMacroIndicators.cpiData[testMacroIndicators.cpiData.length - 1].value;
      indicators.push({
        name: 'CPI YoY',
        value: latestCPI,
        status: getIndicatorStatus('CPI YoY', latestCPI),
      });
    }

    // 10Y Yield
    if (testMacroIndicators.bondYieldData.length > 0) {
      const latestYield =
        testMacroIndicators.bondYieldData[testMacroIndicators.bondYieldData.length - 1].value;
      indicators.push({
        name: '10Y Yield',
        value: latestYield,
        status: getIndicatorStatus('10Y Yield', latestYield),
      });
    }

    // GDP Growth
    if (testMacroIndicators.gdpData.length > 0) {
      const latestGDP = testMacroIndicators.gdpData[testMacroIndicators.gdpData.length - 1].value;
      indicators.push({
        name: 'GDP Growth',
        value: latestGDP,
        status: getIndicatorStatus('GDP Growth', latestGDP),
      });
    }

    // Consumer Confidence
    if (testMacroIndicators.consumerConfidenceData.length > 0) {
      const latestConfidence =
        testMacroIndicators.consumerConfidenceData[
          testMacroIndicators.consumerConfidenceData.length - 1
        ].value;
      indicators.push({
        name: 'Consumer Confidence',
        value: latestConfidence,
        status: getIndicatorStatus('Consumer Confidence', latestConfidence),
      });
    }

    // Unemployment
    if (testMacroIndicators.unemploymentData.length > 0) {
      const latestUnemployment =
        testMacroIndicators.unemploymentData[testMacroIndicators.unemploymentData.length - 1].value;
      indicators.push({
        name: 'Unemployment',
        value: latestUnemployment,
        status: getIndicatorStatus('Unemployment', latestUnemployment),
      });
    }

    return indicators;
  };
  const indicators = getIndicators();
  console.log('MacroIndicators prop:', macroIndicators);
  console.log('Indicators:', indicators);
  console.log('MacroIndicators CPI length:', macroIndicators?.cpiData?.length);
  console.log('MacroIndicators Bond yield length:', macroIndicators?.bondYieldData?.length);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Market Risk Monitor
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Key Indicators Status
          </Typography>{' '}
          <Stack spacing={1}>
            {indicators.map(indicator => (
              <Box
                key={indicator.name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {' '}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: statusColors[indicator.status],
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {indicator.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {indicator.value.toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
