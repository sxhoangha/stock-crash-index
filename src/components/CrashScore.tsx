'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Popover,
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

const indicatorThresholds: Record<
  string,
  {
    healthy: string;
    caution: string;
    warning: string;
    description: string;
  }
> = {
  'CPI YoY': {
    healthy: '1.5% - 3.0%',
    caution: '1.0% - 1.5% or 3.0% - 4.0%',
    warning: '< 1.0% or > 4.0%',
    description: 'Fed targets ~2% inflation. Too low = deflation risk, too high = overheating.',
  },
  '10Y Yield': {
    healthy: '2.0% - 4.0%',
    caution: '< 2.0% or 4.0% - 5.0%',
    warning: '> 5.0%',
    description: 'Very low = recession fears, very high = rate shock risk.',
  },
  'GDP Growth': {
    healthy: '≥ 1.5%',
    caution: '0% - 1.5%',
    warning: '< 0%',
    description: 'Negative growth = recession. Slow growth increases recession risk.',
  },
  'Consumer Confidence': {
    healthy: '> 100',
    caution: '85 - 100',
    warning: '< 85',
    description: 'Consumer spending drives ~70% of US GDP. Low confidence precedes slowdowns.',
  },
  Unemployment: {
    healthy: '3.5% - 5.0%',
    caution: '5.0% - 5.5%',
    warning: '> 5.5%',
    description: '3.5-5% is natural unemployment. Above 5.5% signals labor market weakness.',
  },
  'Yield Curve': {
    healthy: '> 0.5%',
    caution: '0% - 0.5%',
    warning: '< 0%',
    description: 'Inverted yield curve has predicted every recession since 1955.',
  },
  'Jobless Claims': {
    healthy: '< 250,000',
    caution: '250,000 - 350,000',
    warning: '> 350,000',
    description: 'Weekly jobless claims spike before recessions. Leading labor indicator.',
  },
  'Shiller P/E': {
    healthy: '15 - 25',
    caution: '10 - 15 or 25 - 35',
    warning: '> 35 or < 10',
    description: 'Cyclically adjusted P/E ratio. Values >35 indicate bubble territory.',
  },
  'Fed Funds Rate': {
    healthy: '0% - 3%',
    caution: '3% - 5%',
    warning: '> 5%',
    description: 'Shows Fed policy stance. Rates >5% are restrictive and can trigger recessions.',
  },
  'Credit Spread': {
    healthy: '< 400 bps',
    caution: '400 - 600 bps',
    warning: '> 600 bps',
    description: 'High yield bond spread. Widening spreads indicate credit market stress.',
  },
};

export const CrashScoreComponent: React.FC<CrashScoreProps> = ({ data, macroIndicators }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedIndicator, setSelectedIndicator] = React.useState<string | null>(null);

  const handleIndicatorClick = (event: React.MouseEvent<HTMLElement>, indicatorName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndicator(indicatorName);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndicator(null);
  };

  const open = Boolean(anchorEl);

  const getIndicatorStatus = (
    indicator: string,
    value: number
  ): 'healthy' | 'caution' | 'warning' => {
    switch (indicator) {
      case 'CPI YoY':
        if (value >= 1.5 && value <= 3) return 'healthy';
        if ((value > 3 && value <= 4) || (value >= 1 && value < 1.5)) return 'caution';
        return 'warning';

      case '10Y Yield':
        if (value >= 2 && value <= 4) return 'healthy';
        if (value < 2 || (value > 4 && value <= 5)) return 'caution';
        return 'warning';

      case 'GDP Growth':
        if (value >= 1.5) return 'healthy';
        if (value >= 0 && value < 1.5) return 'caution';
        return 'warning';

      case 'Consumer Confidence':
        if (value > 100) return 'healthy';
        if (value >= 85 && value <= 100) return 'caution';
        return 'warning';

      case 'Unemployment':
        if (value >= 3.5 && value <= 5) return 'healthy';
        if (value > 5 && value <= 5.5) return 'caution';
        return 'warning';

      case 'Yield Curve':
        if (value > 0.5) return 'healthy';
        if (value >= 0 && value <= 0.5) return 'caution';
        return 'warning';

      case 'Jobless Claims':
        if (value < 250000) return 'healthy';
        if (value >= 250000 && value <= 350000) return 'caution';
        return 'warning';

      case 'Shiller P/E':
        if (value >= 15 && value <= 25) return 'healthy';
        if ((value >= 25 && value <= 35) || (value >= 10 && value < 15)) return 'caution';
        return 'warning';

      case 'Fed Funds Rate':
        if (value >= 0 && value <= 3) return 'healthy';
        if (value > 3 && value <= 5) return 'caution';
        return 'warning';

      case 'Credit Spread':
        if (value < 400) return 'healthy';
        if (value >= 400 && value <= 600) return 'caution';
        return 'warning';

      default:
        return 'caution';
    }
  };

  const getLatestValue = (data: any[] | undefined, fallback: number): number => {
    return data && data.length > 0 ? data[data.length - 1].value : fallback;
  };

  const getIndicators = (): IndicatorStatus[] => {
    const indicators: IndicatorStatus[] = [
      {
        name: 'CPI YoY',
        value: getLatestValue(macroIndicators?.cpiData, 2.8),
        status: getIndicatorStatus('CPI YoY', getLatestValue(macroIndicators?.cpiData, 2.8)),
      },
      {
        name: '10Y Yield',
        value: getLatestValue(macroIndicators?.bondYieldData, 4.2),
        status: getIndicatorStatus('10Y Yield', getLatestValue(macroIndicators?.bondYieldData, 4.2)),
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
        status: getIndicatorStatus('Unemployment', getLatestValue(macroIndicators?.unemploymentData, 4.2)),
      },
      {
        name: 'Yield Curve',
        value: getLatestValue(macroIndicators?.yieldCurveData, 0.5),
        status: getIndicatorStatus('Yield Curve', getLatestValue(macroIndicators?.yieldCurveData, 0.5)),
      },
      {
        name: 'Jobless Claims',
        value: getLatestValue(macroIndicators?.joblessClaimsData, 220000),
        status: getIndicatorStatus('Jobless Claims', getLatestValue(macroIndicators?.joblessClaimsData, 220000)),
      },
      {
        name: 'Shiller P/E',
        value: macroIndicators?.currentShillerPE ?? 30,
        status: getIndicatorStatus('Shiller P/E', macroIndicators?.currentShillerPE ?? 30),
      },
      {
        name: 'Fed Funds Rate',
        value: getLatestValue(macroIndicators?.fedFundsRateData, 4.5),
        status: getIndicatorStatus('Fed Funds Rate', getLatestValue(macroIndicators?.fedFundsRateData, 4.5)),
      },
      {
        name: 'Credit Spread',
        value: getLatestValue(macroIndicators?.creditSpreadData, 350),
        status: getIndicatorStatus('Credit Spread', getLatestValue(macroIndicators?.creditSpreadData, 350)),
      },
    ];

    return indicators;
  };

  const indicators = getIndicators();
  const thresholdInfo = selectedIndicator ? indicatorThresholds[selectedIndicator] : null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Market Risk Monitor
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Key Indicators Status
          </Typography>
          {/* Color Legend */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: statusColors.healthy,
                  borderRadius: 1,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Healthy
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: statusColors.caution,
                  borderRadius: 1,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Caution
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: statusColors.warning,
                  borderRadius: 1,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Warning
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Click on any indicator to see threshold details
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
              },
              gap: 1,
            }}
          >
            {indicators.map((indicator) => (
              <Box
                key={indicator.name}
                onClick={(e) => handleIndicatorClick(e, indicator.name)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: statusColors[indicator.status],
                    borderRadius: 1,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                  {indicator.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {indicator.name === 'Consumer Confidence'
                    ? indicator.value.toFixed(1)
                    : indicator.name === 'Jobless Claims'
                      ? indicator.value.toLocaleString('en-US', { maximumFractionDigits: 0 })
                      : indicator.name === 'Shiller P/E'
                        ? indicator.value.toFixed(1)
                        : indicator.name === 'Credit Spread'
                          ? `${indicator.value.toFixed(0)} bps`
                          : `${indicator.value.toFixed(1)}%`}
                </Typography>
              </Box>
            ))}
          </Box>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {thresholdInfo && (
              <Box sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedIndicator}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1.5 }}>
                  {thresholdInfo.description}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: statusColors.healthy,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="caption">
                      <strong>Healthy:</strong> {thresholdInfo.healthy}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: statusColors.caution,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="caption">
                      <strong>Caution:</strong> {thresholdInfo.caution}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: statusColors.warning,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="caption">
                      <strong>Warning:</strong> {thresholdInfo.warning}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Popover>
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
