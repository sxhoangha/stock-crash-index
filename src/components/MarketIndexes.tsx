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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketIndexesProps {
  data: MarketData[];
  title: string;
  color: string;
}

export const MarketIndexes: React.FC<MarketIndexesProps> = ({
  data,
  title,
  color,
}) => {  const hasData = Array.isArray(data) && data.length > 0;

  const chartData = {
    labels: hasData ? data.map((d) => {
      const date = new Date(d.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }) : [],
    datasets: [
      {
        label: title,
        data: hasData ? data.map((d) => d.value) : [],
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
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
  };

  const latestValue = hasData ? data[data.length - 1]?.value : undefined;
  const previousValue = hasData ? data[data.length - 2]?.value : undefined;
  const percentageChange = (hasData && previousValue && latestValue !== undefined)
    ? ((latestValue - previousValue) / previousValue) * 100
    : 0;
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {hasData ? (
          <>
            <Typography
              variant="h4"
              gutterBottom
              color={percentageChange >= 0 ? 'success.main' : 'error.main'}
            >
              {formatNumber(latestValue)}
            </Typography>
            <Typography
              variant="body2"
              color={percentageChange >= 0 ? 'success.main' : 'error.main'}
              gutterBottom
            >
              {percentageChange >= 0 ? '+' : ''}
              {formatNumber(percentageChange)}%
            </Typography>
            <div style={{ height: 200 }}>
              <Line data={chartData} options={options} />
            </div>
          </>
        ) : (
          <Typography color="text.secondary">Loading data...</Typography>
        )}
      </CardContent>
    </Card>
  );
};
