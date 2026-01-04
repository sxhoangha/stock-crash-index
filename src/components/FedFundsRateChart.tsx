'use client';

import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useResponsiveChart } from '@/hooks/useResponsiveChart';
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

interface FedFundsRateChartProps {
  data: MarketData[];
}

export const FedFundsRateChart: React.FC<FedFundsRateChartProps> = ({ data }) => {
  const { getResponsiveOptions } = useResponsiveChart();
  const hasData = Array.isArray(data) && data.length > 0;
  const latestValue = hasData ? data[data.length - 1]?.value : undefined;

  const chartData = {
    labels: hasData
      ? data.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        })
      : [],
    datasets: [
      {
        label: 'Federal Funds Rate',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#00bcd4',
        backgroundColor: '#00bcd420',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const baseOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatNumber(context.raw)}%`,
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
        ticks: {
          callback: function (value: string | number): string {
            return `${value}%`;
          },
        },
      },
    },
  };

  const options = getResponsiveOptions(baseOptions);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Federal Funds Rate
        </Typography>
        <Typography variant="h4" sx={{ color: '#00bcd4', mb: 2 }}>
          {latestValue !== undefined ? `${formatNumber(latestValue)}%` : 'Loading...'}
        </Typography>
        {!hasData ? (
          <CircularProgress />
        ) : (
          <Box sx={{ height: { xs: '250px', md: '300px' }, width: '100%' }}>
            <Line data={chartData} options={options} />
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Fed Policy Stance: {latestValue !== undefined && latestValue > 4 ? 'Restrictive' : latestValue !== undefined && latestValue > 2 ? 'Neutral' : 'Accommodative'}
        </Typography>
      </CardContent>
    </Card>
  );
};
