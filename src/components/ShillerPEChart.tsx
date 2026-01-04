'use client';

import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MarketData } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ShillerPEChartProps {
  data?: MarketData[];
  currentValue?: number | null;
}

export const ShillerPEChart: React.FC<ShillerPEChartProps> = ({ data, currentValue }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const latestValue = hasData ? data[data.length - 1]?.value : currentValue;

  const chartData = {
    labels: hasData
      ? data.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        })
      : [],
    datasets: [
      {
        label: 'Shiller CAPE Ratio',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#3f51b5',
        backgroundColor: '#3f51b520',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatNumber(context.raw, 1)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f0f0f0',
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Determine color based on value
  const getColor = () => {
    if (latestValue === undefined || latestValue === null) return '#757575';
    if (latestValue > 30) return '#f44336'; // Red - Warning (bubble territory)
    if (latestValue > 25) return '#ff9800'; // Orange - Caution (elevated)
    return '#4caf50'; // Green - Healthy
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shiller P/E Ratio (CAPE)
        </Typography>
        <Typography variant="h4" sx={{ color: getColor(), mb: 2 }}>
          {latestValue !== undefined && latestValue !== null ? formatNumber(latestValue, 1) : 'Loading...'}
        </Typography>
        {!hasData && latestValue === undefined ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
          </Box>
        ) : hasData ? (
          <div style={{ position: 'relative', height: '300px' }}>
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current value only (no historical chart data available)
            </Typography>
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Historical Average: ~17 | Current: {latestValue !== undefined && latestValue !== null ? formatNumber(latestValue, 1) : 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};
