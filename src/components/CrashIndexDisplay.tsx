'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { CrashIndex, crashIndexColors } from '@/lib/types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface CrashIndexDisplayProps {
  data: CrashIndex;
}

export const CrashIndexDisplay: React.FC<CrashIndexDisplayProps> = ({ data }) => {
  const riskColor = crashIndexColors[data.risk];

  const getRiskIcon = () => {
    switch (data.risk) {
      case 'Low':
      case 'Moderate':
        return <TrendingUpIcon sx={{ fontSize: 40, color: riskColor }} />;
      case 'Elevated':
        return <WarningAmberIcon sx={{ fontSize: 40, color: riskColor }} />;
      case 'High':
      case 'Extreme':
        return <ErrorOutlineIcon sx={{ fontSize: 40, color: riskColor }} />;
    }
  };

  const getRiskDescription = () => {
    switch (data.risk) {
      case 'Low':
        return 'Market conditions are favorable. Risk of crash is minimal.';
      case 'Moderate':
        return 'Some warning signs present. Monitor market closely.';
      case 'Elevated':
        return 'Multiple risk factors detected. Consider reducing exposure.';
      case 'High':
        return 'Significant crash risk. Defensive positioning recommended.';
      case 'Extreme':
        return 'EXTREME RISK! Crash may be imminent or in progress.';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Market Crash Index
        </Typography>

        {/* Main Score Display */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {getRiskIcon()}
            <Typography variant="h2" sx={{ color: riskColor, fontWeight: 'bold', mt: 1 }}>
              {data.score}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              out of 100
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Chip
              label={data.risk.toUpperCase() + ' RISK'}
              sx={{
                backgroundColor: riskColor,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                py: 3,
                mb: 2,
              }}
            />
            <Typography variant="body1" color="text.secondary">
              {getRiskDescription()}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption">Risk Score</Typography>
            <Typography variant="caption" sx={{ color: riskColor, fontWeight: 'bold' }}>
              {data.score}/100
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={data.score}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: riskColor,
                borderRadius: 5,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              0 - Low
            </Typography>
            <Typography variant="caption" color="text.secondary">
              20 - Moderate
            </Typography>
            <Typography variant="caption" color="text.secondary">
              40 - Elevated
            </Typography>
            <Typography variant="caption" color="text.secondary">
              60 - High
            </Typography>
            <Typography variant="caption" color="text.secondary">
              80+ - Extreme
            </Typography>
          </Box>
        </Box>

        {/* Breakdown by Category */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 3 }}>
          Score Breakdown
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
          {/* Leading Indicators */}
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Leading
            </Typography>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              {data.breakdown.leadingIndicators}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / 40
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(data.breakdown.leadingIndicators / 40) * 100}
              sx={{
                mt: 1,
                height: 4,
                backgroundColor: '#e3f2fd',
                '& .MuiLinearProgress-bar': { backgroundColor: '#1976d2' },
              }}
            />
          </Box>

          {/* Concurrent Indicators */}
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Concurrent
            </Typography>
            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
              {data.breakdown.concurrentIndicators}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / 35
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(data.breakdown.concurrentIndicators / 35) * 100}
              sx={{
                mt: 1,
                height: 4,
                backgroundColor: '#fff3e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' },
              }}
            />
          </Box>

          {/* Lagging Indicators */}
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Lagging
            </Typography>
            <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
              {data.breakdown.laggingIndicators}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / 25
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(data.breakdown.laggingIndicators / 25) * 100}
              sx={{
                mt: 1,
                height: 4,
                backgroundColor: '#f3e5f5',
                '& .MuiLinearProgress-bar': { backgroundColor: '#9c27b0' },
              }}
            />
          </Box>
        </Box>

        {/* Active Risk Factors */}
        {data.factors.length > 0 && (
          <>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              ⚠️ Active Risk Factors ({data.factors.length})
            </Typography>
            <List dense sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
              {data.factors.map((factor, index) => (
                <ListItem key={index} sx={{ borderBottom: index < data.factors.length - 1 ? '1px solid #eee' : 'none' }}>
                  <ListItemText
                    primary={factor}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: 'text.primary',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {data.factors.length === 0 && (
          <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#2e7d32' }}>
              ✓ No significant risk factors detected
            </Typography>
          </Box>
        )}

        {/* Timestamp */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'right' }}>
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};
