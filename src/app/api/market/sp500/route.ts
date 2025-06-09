import { NextResponse } from 'next/server';
import axios from 'axios';

const SPY_SYMBOL = 'SPY'; // S&P 500 ETF

export async function GET() {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${SPY_SYMBOL}?range=1mo&interval=1d`
    );
    const result = response.data.chart.result[0];
    if (!result || !result.timestamp || !result.indicators.quote[0].close) {
      console.error('Unexpected Yahoo Finance API response:', response.data);
      throw new Error('Invalid API response format');
    }

    const timestamps = result.timestamp;
    const closePrices = result.indicators.quote[0].close;

    const last30Days = timestamps
      .map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        value: closePrices[index] || null,
      }))
      .filter((item: { value: number | null }) => item.value !== null);

    return NextResponse.json(last30Days);
  } catch (error) {
    console.error('Error fetching S&P 500 data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch S&P 500 data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
