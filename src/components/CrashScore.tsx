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
  Stack,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
        if (value >= 1.5) return 'healthy';
        if (value >= 0 && value < 1.5) return 'caution';
        return 'warning'; // <0% (negative growth = recession)

      case 'Consumer Confidence':
        if (value > 100) return 'healthy';
        if (value >= 85 && value <= 100) return 'caution';
        return 'warning'; // <85

      case 'Unemployment':
        if (value >= 3.5 && value <= 5) return 'healthy';
        if (value > 5 && value <= 5.5) return 'caution';
        return 'warning'; // >5.5% or sharp rise

      case 'Yield Curve':
        if (value > 0.5) return 'healthy';
        if (value >= 0 && value <= 0.5) return 'caution';
        return 'warning'; // <0% (inverted)

      case 'Jobless Claims':
        if (value < 250000) return 'healthy';
        if (value >= 250000 && value <= 350000) return 'caution';
        return 'warning'; // >350K

      case 'Shiller P/E':
        if (value >= 15 && value <= 25) return 'healthy';
        if ((value >= 25 && value <= 35) || (value >= 10 && value < 15)) return 'caution';
        return 'warning'; // >35 or <10

      case 'Fed Funds Rate':
        if (value >= 0 && value <= 3) return 'healthy';
        if (value > 3 && value <= 5) return 'caution';
        return 'warning'; // >5%

      case 'Credit Spread':
        if (value < 400) return 'healthy';
        if (value >= 400 && value <= 600) return 'caution';
        return 'warning'; // >600bps

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
      {
        name: 'Yield Curve',
        value: getLatestValue(macroIndicators?.yieldCurveData, 0.5),
        status: getIndicatorStatus(
          'Yield Curve',
          getLatestValue(macroIndicators?.yieldCurveData, 0.5)
        ),
      },
      {
        name: 'Jobless Claims',
        value: getLatestValue(macroIndicators?.joblessClaimsData, 220000),
        status: getIndicatorStatus(
          'Jobless Claims',
          getLatestValue(macroIndicators?.joblessClaimsData, 220000)
        ),
      },
      {
        name: 'Shiller P/E',
        value: macroIndicators?.currentShillerPE ?? 30,
        status: getIndicatorStatus('Shiller P/E', macroIndicators?.currentShillerPE ?? 30),
      },
      {
        name: 'Fed Funds Rate',
        value: getLatestValue(macroIndicators?.fedFundsRateData, 4.5),
        status: getIndicatorStatus(
          'Fed Funds Rate',
          getLatestValue(macroIndicators?.fedFundsRateData, 4.5)
        ),
      },
      {
        name: 'Credit Spread',
        value: getLatestValue(macroIndicators?.creditSpreadData, 350),
        status: getIndicatorStatus(
          'Credit Spread',
          getLatestValue(macroIndicators?.creditSpreadData, 350)
        ),
      },
    ];

    return indicators;
  };
  const indicators = getIndicators();
  const [showLogic, setShowLogic] = React.useState(false);

  const indicatorThresholds = [
    {
      name: 'CPI YoY',
      healthy: '1.5% - 3.0%',
      caution: '1.0% - 1.5% or 3.0% - 4.0%',
      warning: '< 1.0% or > 4.0%',
      description: 'Fed targets ~2% inflation. Too low = deflation risk, too high = overheating.',
    },
    {
      name: '10Y Yield',
      healthy: '2.0% - 4.0%',
      caution: '< 2.0% or 4.0% - 5.0%',
      warning: '> 5.0%',
      description: 'Very low = recession fears, very high = rate shock risk.',
    },
    {
      name: 'GDP Growth',
      healthy: '≥ 1.5%',
      caution: '0% - 1.5%',
      warning: '< 0%',
      description: 'Negative growth = recession. Slow growth increases recession risk.',
    },
    {
      name: 'Consumer Confidence',
      healthy: '> 100',
      caution: '85 - 100',
      warning: '< 85',
      description: 'Consumer spending drives ~70% of US GDP. Low confidence precedes slowdowns.',
    },
    {
      name: 'Unemployment',
      healthy: '3.5% - 5.0%',
      caution: '5.0% - 5.5%',
      warning: '> 5.5%',
      description: '3.5-5% is natural unemployment. Above 5.5% signals labor market weakness.',
    },
    {
      name: 'Yield Curve',
      healthy: '> 0.5%',
      caution: '0% - 0.5%',
      warning: '< 0%',
      description: 'Inverted yield curve has predicted every recession since 1955.',
    },
    {
      name: 'Jobless Claims',
      healthy: '< 250,000',
      caution: '250,000 - 350,000',
      warning: '> 350,000',
      description: 'Weekly jobless claims spike before recessions. Leading labor indicator.',
    },
    {
      name: 'Shiller P/E',
      healthy: '15 - 25',
      caution: '10 - 15 or 25 - 35',
      warning: '> 35 or < 10',
      description: 'Cyclically adjusted P/E ratio. Values >35 indicate bubble territory.',
    },
    {
      name: 'Fed Funds Rate',
      healthy: '0% - 3%',
      caution: '3% - 5%',
      warning: '> 5%',
      description: 'Shows Fed policy stance. Rates >5% are restrictive and can trigger recessions.',
    },
    {
      name: 'Credit Spread',
      healthy: '< 400 bps',
      caution: '400 - 600 bps',
      warning: '> 600 bps',
      description: 'High yield bond spread. Widening spreads indicate credit market stress.',
    },
  ];

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
          {/* Indicator Logic Toggle */}
          <Box sx={{ mb: 2 }}>
            <Box
              onClick={() => setShowLogic(!showLogic)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': { opacity: 0.7 },
              }}
            >
              <Typography variant="caption" color="primary" sx={{ fontWeight: 'medium' }}>
                {showLogic ? 'Hide' : 'Show'} Indicator Thresholds
              </Typography>
              <IconButton size="small" sx={{ p: 0 }}>
                {showLogic ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
            <Collapse in={showLogic}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Stack spacing={2}>
                  {indicatorThresholds.map(threshold => (
                    <Box key={threshold.name}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {threshold.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {threshold.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, ml: 1 }}>
                        <Typography variant="caption">
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              backgroundColor: statusColors.healthy,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                          />
                          Healthy: {threshold.healthy}
                        </Typography>
                        <Typography variant="caption">
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              backgroundColor: statusColors.caution,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                          />
                          Caution: {threshold.caution}
                        </Typography>
                        <Typography variant="caption">
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              backgroundColor: statusColors.warning,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                          />
                          Warning: {threshold.warning}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </Box>
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
            ))}{' '}
          </Stack>
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
