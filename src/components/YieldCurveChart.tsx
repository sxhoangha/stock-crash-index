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

interface YieldCurveChartProps {
  data: MarketData[];
}

export const YieldCurveChart: React.FC<YieldCurveChartProps> = ({ data }) => {
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
        label: 'Yield Curve (10Y-2Y)',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: latestValue !== undefined && latestValue < 0 ? '#f44336' : '#4caf50',
        backgroundColor: latestValue !== undefined && latestValue < 0 ? '#f4433620' : '#4caf5020',
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
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Yield Curve (10Y-2Y Spread)
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: latestValue !== undefined && latestValue < 0 ? '#f44336' : '#4caf50',
            mb: 2,
          }}
        >
          {latestValue !== undefined ? `${formatNumber(latestValue)}%` : 'Loading...'}
        </Typography>
        {!hasData ? (
          <CircularProgress />
        ) : (
          <div style={{ position: 'relative', height: '250px' }}>
            <Line data={chartData} options={options} />
          </div>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {latestValue !== undefined && latestValue < 0
            ? '⚠️ Inverted - Recession Signal'
            : '✓ Normal Curve'}
        </Typography>
      </CardContent>
    </Card>
  );
};
