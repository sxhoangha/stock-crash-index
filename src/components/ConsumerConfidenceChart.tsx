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

interface ConsumerConfidenceChartProps {
  data: MarketData[];
}

export const ConsumerConfidenceChart: React.FC<ConsumerConfidenceChartProps> = ({ data }) => {
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
        label: 'Consumer Confidence Index',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#4caf50',
        backgroundColor: '#4caf5020',
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
          label: (context: any) => `${context.dataset.label}: ${formatNumber(context.raw)}`,
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
            return formatNumber(value as number);
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
          Consumer Confidence Index
        </Typography>
        <Typography variant="h4" sx={{ color: '#4caf50', mb: 2 }}>
          {latestValue !== undefined ? formatNumber(latestValue, 1) : 'Loading...'}
        </Typography>
        {hasData ? (
          <div style={{ position: 'relative', height: '300px' }}>
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <Typography color="text.secondary">Loading consumer confidence data...</Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Consumer economic sentiment indicator
        </Typography>
      </CardContent>
    </Card>
  );
};
