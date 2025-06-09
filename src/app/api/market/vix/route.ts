import { NextResponse } from 'next/server';
import axios from 'axios';

// Yahoo Finance API provides reliable VIX data without requiring an API key
const VIX_SYMBOL = '%5EVIX'; // ^VIX URL encoded

export async function GET() {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${VIX_SYMBOL}?range=1mo&interval=1d`
    );
    const result = response.data.chart.result[0];
    if (!result || !result.timestamp || !result.indicators.quote[0].close) {
      console.error('Unexpected Yahoo Finance API response:', response.data);
      return NextResponse.json(
        { error: 'Invalid API response format', details: response.data },
        { status: 500 }
      );
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
  } catch (error: any) {
    console.error('Error fetching VIX data:', error.response?.data || error.message);
    return NextResponse.json(
      {
        error: 'Failed to fetch VIX data',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
