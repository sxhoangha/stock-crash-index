'use client';

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
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

interface BondYieldChartProps {
  data: MarketData[];
}

export const BondYieldChart: React.FC<BondYieldChartProps> = ({ data }) => {
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
        label: '10-Year Treasury Yield',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#9c27b0',
        backgroundColor: '#9c27b020',
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
          10-Year Treasury Yield
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          U.S. government bond yield benchmark
          {hasData && (
            <Typography component="span" variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
              (Current: {formatNumber(latestValue)}%)
            </Typography>
          )}
        </Typography>
        {hasData ? (
          <div style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <Typography color="text.secondary">Loading bond yield data...</Typography>
        )}
      </CardContent>
    </Card>
  );
};
