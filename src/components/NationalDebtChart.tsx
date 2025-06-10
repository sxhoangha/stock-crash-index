'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
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

interface NationalDebtChartProps {
  totalDebtData: MarketData[];
  debtToGdpData: MarketData[];
}

export const NationalDebtChart: React.FC<NationalDebtChartProps> = ({
  totalDebtData,
  debtToGdpData,
}) => {
  // Combine both datasets by date
  const combinedData = React.useMemo(() => {
    const dataMap = new Map();

    // Add total debt data
    totalDebtData.forEach(item => {
      dataMap.set(item.date, {
        date: item.date,
        totalDebt: item.value,
        debtToGdp: null,
      });
    });

    // Add debt-to-GDP data
    debtToGdpData.forEach(item => {
      const existing = dataMap.get(item.date);
      if (existing) {
        existing.debtToGdp = item.value;
      } else {
        dataMap.set(item.date, {
          date: item.date,
          totalDebt: null,
          debtToGdp: item.value,
        });
      }
    });

    // Convert to array and sort by date
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-60); // Show last 60 data points
  }, [totalDebtData, debtToGdpData]);

  const formatTotalDebt = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}T`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}B`;
    } else if (value >= 1) {
      return `$${value.toFixed(0)}M`;
    }
    return `$${value.toFixed(2)}M`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'short',
    });
  };

  if (!combinedData.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            National Debt
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading national debt data...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data for Chart.js
  const chartData = {
    labels: combinedData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Total Public Debt',
        data: combinedData.map(item => (item.totalDebt !== null ? item.totalDebt : undefined)),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y',
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false,
      },
      {
        label: 'Debt as % of GDP',
        data: combinedData.map(item => (item.debtToGdp !== null ? item.debtToGdp : undefined)),
        borderColor: '#d32f2f',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1',
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            if (value === null || value === undefined) return '';

            if (context.datasetIndex === 0) {
              return `Total Debt: ${formatTotalDebt(value)}`;
            } else {
              return `Debt/GDP: ${value.toFixed(1)}%`;
            }
          },
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Total Debt',
          color: '#1976d2',
        },
        ticks: {
          callback: function (value: any) {
            return formatTotalDebt(value);
          },
          color: '#1976d2',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Debt as % of GDP',
          color: '#d32f2f',
        },
        ticks: {
          callback: function (value: any) {
            return `${value.toFixed(0)}%`;
          },
          color: '#d32f2f',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          National Debt
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Federal debt total and as percentage of GDP
        </Typography>
        <div style={{ height: '300px', width: '100%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
