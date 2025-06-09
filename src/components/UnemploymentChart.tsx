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

interface UnemploymentChartProps {
  data: MarketData[];
}

export const UnemploymentChart: React.FC<UnemploymentChartProps> = ({ data }) => {
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
        label: 'Unemployment Rate',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#ff9800',
        backgroundColor: '#ff980020',
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
        min: 0, // Start y-axis from 0
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Unemployment Rate
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
          <Typography color="text.secondary">Loading unemployment data...</Typography>
        )}
      </CardContent>
    </Card>
  );
};
