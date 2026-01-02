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

interface ShillerPEChartProps {
  data: MarketData[];
}

export const ShillerPEChart: React.FC<ShillerPEChartProps> = ({ data }) => {
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shiller P/E Ratio (CAPE)
        </Typography>
        <Typography variant="h4" sx={{ color: '#3f51b5', mb: 2 }}>
          {latestValue !== undefined ? formatNumber(latestValue, 1) : 'Loading...'}
        </Typography>
        {!hasData ? (
          <CircularProgress />
        ) : (
          <div style={{ position: 'relative', height: '250px' }}>
            <Line data={chartData} options={options} />
          </div>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Historical Average: ~17 | Current: {latestValue !== undefined ? formatNumber(latestValue, 1) : 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};
