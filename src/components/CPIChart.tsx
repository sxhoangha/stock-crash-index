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

interface CPIChartProps {
  data: MarketData[];
  inflationData: MarketData[];
}

export const CPIChart: React.FC<CPIChartProps> = ({ data, inflationData }) => {
  const hasCPIData = Array.isArray(data) && data.length > 0;
  const hasInflationData = Array.isArray(inflationData) && inflationData.length > 0;
  const latestCPI = hasCPIData ? data[data.length - 1]?.value : undefined;
  const latestInflation = hasInflationData
    ? inflationData[inflationData.length - 1]?.value
    : undefined;

  const chartData = {
    labels: hasCPIData
      ? data.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        })
      : [],
    datasets: [
      {
        label: 'CPI (YoY %)',

        data: hasCPIData ? data.map(d => d.value) : [],
        borderColor: '#ff6b6b',
        backgroundColor: '#ff6b6b20',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'PCE Index (YoY %)',
        data: hasInflationData ? inflationData.map(d => d.value) : [],
        borderColor: '#4caf50',
        backgroundColor: '#4caf5020',
        fill: true,
        tension: 0.4,
        yAxisID: 'pce',
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
          label: (context: any) => {
            const value = context.raw.toFixed(1);
            return `${context.dataset.label}: ${value}%`;
          },
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
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'CPI (YoY %)',
          color: '#ff6b6b',
        },
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function (value: string | number): string {
            return `${Number(value).toFixed(1)}%`;
          },
          color: '#ff6b6b',
        },
      },
      pce: {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'PCE Index (YoY %)',
          color: '#4caf50',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value: string | number): string {
            return `${Number(value).toFixed(1)}%`;
          },
          color: '#4caf50',
        },
      },
    },
    maintainAspectRatio: false,
  };

  const renderContent = () => {
    if (!Array.isArray(data) || !Array.isArray(inflationData)) {
      return (
        <Typography color="error">
          Error: Invalid data format received. Please try refreshing the page.
        </Typography>
      );
    }

    if (data.length === 0 || inflationData.length === 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">Loading price indices data...</Typography>
        </Box>
      );
    }

    return (
      <div style={{ height: '300px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Price Indices (Year-over-Year Change)
          {hasCPIData && hasInflationData && (
            <Typography component="span" variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
              (CPI: {formatNumber(latestCPI)}% | PCE: {formatNumber(latestInflation)}%)
            </Typography>
          )}
        </Typography>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
