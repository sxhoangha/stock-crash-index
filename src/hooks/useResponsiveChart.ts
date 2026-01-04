'use client';

import { useState, useEffect } from 'react';

export const useResponsiveChart = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getResponsiveOptions = (baseOptions: any = {}) => {
    return {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins?.legend,
          labels: {
            ...baseOptions.plugins?.legend?.labels,
            font: {
              size: isMobile ? 10 : 12,
            },
            boxWidth: isMobile ? 15 : 40,
            padding: isMobile ? 8 : 10,
          },
        },
      },
      scales: {
        ...baseOptions.scales,
        x: {
          ...baseOptions.scales?.x,
          ticks: {
            ...baseOptions.scales?.x?.ticks,
            font: {
              size: isMobile ? 9 : 11,
            },
            maxRotation: isMobile ? 45 : 0,
            minRotation: isMobile ? 45 : 0,
            maxTicksLimit: isMobile ? 6 : 12,
          },
        },
        y: {
          ...baseOptions.scales?.y,
          title: {
            ...baseOptions.scales?.y?.title,
            display: !isMobile && baseOptions.scales?.y?.title?.display !== false,
            font: {
              size: isMobile ? 10 : 11,
            },
          },
          ticks: {
            ...baseOptions.scales?.y?.ticks,
            font: {
              size: isMobile ? 9 : 11,
            },
            maxTicksLimit: isMobile ? 5 : 8,
          },
        },
      },
    };
  };

  const getMultiAxisOptions = (baseOptions: any = {}, secondAxis: string = 'pce') => {
    const responsive = getResponsiveOptions(baseOptions);

    if (responsive.scales[secondAxis]) {
      responsive.scales[secondAxis] = {
        ...responsive.scales[secondAxis],
        title: {
          ...responsive.scales[secondAxis]?.title,
          display: !isMobile && responsive.scales[secondAxis]?.title?.display !== false,
          font: {
            size: isMobile ? 10 : 11,
          },
        },
        ticks: {
          ...responsive.scales[secondAxis]?.ticks,
          font: {
            size: isMobile ? 9 : 11,
          },
          maxTicksLimit: isMobile ? 5 : 8,
        },
      };
    }

    return responsive;
  };

  return {
    isMobile,
    getResponsiveOptions,
    getMultiAxisOptions,
  };
};
