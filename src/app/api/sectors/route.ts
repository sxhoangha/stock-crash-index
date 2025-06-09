import { NextResponse } from 'next/server';
import axios from 'axios';

// Disabled sector data fetching
// const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// const SECTOR_ETFS = [
//   'XLF', // Financial
//   'XLK', // Technology
//   'XLE', // Energy
//   'XLV', // Healthcare
//   'XLI', // Industrial
//   'XLP', // Consumer Staples
//   'XLB', // Materials
//   'XLY', // Consumer Discretionary
// ];

export async function GET() {
  return NextResponse.json(
    { message: 'Sectors API endpoint temporarily disabled' },
    { status: 503 }
  );

  // Original implementation commented out
  // try {
  //   const sectorData = await Promise.all(
  //     SECTOR_ETFS.map(async symbol => {
  //       const response = await axios.get(
  //         `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
  //       );
  //       return {
  //         symbol: symbol.toLowerCase(),
  //         value: parseFloat(response.data['Global Quote']['10. change percent'].replace('%', '')),
  //       };
  //     })
  //   );

  //   const sectorPerformance = sectorData.reduce(
  //     (acc, { symbol, value }) => {
  //       acc[symbol] = value;
  //       return acc;
  //     },
  //     {} as Record<string, number>
  //   );

  //   return NextResponse.json(sectorPerformance);
  // } catch (error) {
  //   console.error('Error fetching sector performance:', error);
  //   return NextResponse.json({ error: 'Failed to fetch sector performance' }, { status: 500 });
  // }
}
