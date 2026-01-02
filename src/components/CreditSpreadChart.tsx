'use client';

import React from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
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

interface CreditSpreadChartProps {
  data: MarketData[];
}

export const CreditSpreadChart: React.FC<CreditSpreadChartProps> = ({ data }) => {
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
        label: 'High Yield Credit Spread',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#e91e63',
        backgroundColor: '#e91e6320',
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
          label: (context: any) => `${context.dataset.label}: ${formatNumber(context.raw, 0)} bps`,
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
            return `${value} bps`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Corporate Credit Spread
        </Typography>
        <Typography variant="h4" sx={{ color: '#e91e63', mb: 2 }}>
          {latestValue !== undefined ? `${formatNumber(latestValue, 0)} bps` : 'Loading...'}
        </Typography>
        {!hasData ? (
          <CircularProgress />
        ) : (
          <div style={{ position: 'relative', height: '250px' }}>
            <Line data={chartData} options={options} />
          </div>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          High Yield Bond Spread over Treasuries (basis points)
        </Typography>
      </CardContent>
    </Card>
  );
};
