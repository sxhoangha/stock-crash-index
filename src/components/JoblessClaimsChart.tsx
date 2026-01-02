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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface JoblessClaimsChartProps {
  data: MarketData[];
}

export const JoblessClaimsChart: React.FC<JoblessClaimsChartProps> = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const latestValue = hasData ? data[data.length - 1]?.value : undefined;

  const chartData = {
    labels: hasData
      ? data.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        })
      : [],
    datasets: [
      {
        label: 'Initial Jobless Claims',
        data: hasData ? data.map(d => d.value) : [],
        borderColor: '#ff5722',
        backgroundColor: '#ff572220',
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
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw.toLocaleString('en-US')}`,
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
            return Number(value).toLocaleString('en-US');
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
          Weekly Initial Jobless Claims
        </Typography>
        <Typography variant="h4" sx={{ color: '#ff5722', mb: 2 }}>
          {latestValue !== undefined
            ? latestValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
            : 'Loading...'}
        </Typography>
        {!hasData ? (
          <CircularProgress />
        ) : (
          <div style={{ position: 'relative', height: '250px' }}>
            <Line data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
