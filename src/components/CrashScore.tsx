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

  const getLatestValue = (data: any[] | undefined, fallback: number): number => {
    return data && data.length > 0 ? data[data.length - 1].value : fallback;
  };

  const getIndicators = (): IndicatorStatus[] => {
    // Use fallback values if macroIndicators is not available or data is empty
    const indicators: IndicatorStatus[] = [
      {
        name: 'CPI YoY',
        value: getLatestValue(macroIndicators?.cpiData, 2.8),
        status: getIndicatorStatus('CPI YoY', getLatestValue(macroIndicators?.cpiData, 2.8)),
      },
      {
        name: '10Y Yield',
        value: getLatestValue(macroIndicators?.bondYieldData, 4.2),
        status: getIndicatorStatus(
          '10Y Yield',
          getLatestValue(macroIndicators?.bondYieldData, 4.2)
        ),
      },
      {
        name: 'GDP Growth',
        value: getLatestValue(macroIndicators?.gdpData, 2.1),
        status: getIndicatorStatus('GDP Growth', getLatestValue(macroIndicators?.gdpData, 2.1)),
      },
      {
        name: 'Consumer Confidence',
        value: getLatestValue(macroIndicators?.consumerConfidenceData, 95.0),
        status: getIndicatorStatus(
          'Consumer Confidence',
          getLatestValue(macroIndicators?.consumerConfidenceData, 95.0)
        ),
      },
      {
        name: 'Unemployment',
        value: getLatestValue(macroIndicators?.unemploymentData, 4.2),
        status: getIndicatorStatus(
          'Unemployment',
          getLatestValue(macroIndicators?.unemploymentData, 4.2)
        ),
      },
    ];

    return indicators;
  };
  const indicators = getIndicators();
  const normalizedValue = (data.score / 10) * 100;

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
            ))}{' '}
          </Stack>
        </Box>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            marginBottom: 2,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={normalizedValue}
            size={120}
            thickness={4}
            sx={{
              color:
                statusColors[
                  normalizedValue <= 33 ? 'healthy' : normalizedValue <= 66 ? 'caution' : 'warning'
                ],
              circle: {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              component="div"
              color={
                statusColors[
                  normalizedValue <= 33 ? 'healthy' : normalizedValue <= 66 ? 'caution' : 'warning'
                ]
              }
            >
              {data.score}
            </Typography>
          </Box>
        </Box>
        {data.factors.length > 0 && (
          <>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Risk Factors
            </Typography>
            <List dense>
              {data.factors.map((factor, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={factor}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.secondary',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};
