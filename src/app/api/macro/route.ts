import { NextResponse } from 'next/server';
import axios from 'axios';

const FRED_API_KEY = process.env.FRED_API_KEY || 'demo';
const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

function calculateYoYChange(observations: any[]): { date: string; value: number }[] {
  if (!Array.isArray(observations) || observations.length < 13) {
    console.error('Not enough data points for YoY calculation:', observations?.length);
    return [];
  }

  const values = observations
    .map(obs => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }))
    .reverse();

  return values.slice(12).map((current, index) => {
    if (isNaN(current.value) || isNaN(values[index].value) || values[index].value === 0) {
      console.error('Invalid values for YoY calculation:', { current, base: values[index] });
      return { date: current.date, value: 0 };
    }
    const yoyChange = ((current.value - values[index].value) / values[index].value) * 100;
    return {
      date: current.date,
      value: yoyChange,
    };
  });
}

export async function GET() {
  try {
    if (!FRED_API_KEY || FRED_API_KEY === 'demo') {
      throw new Error('FRED API key not configured');
    }

    // Calculate date ranges
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // For YoY calculations, we need 13 months of data
    const thirteenMonthsAgo = new Date(today);
    thirteenMonthsAgo.setMonth(today.getMonth() - 24); // Get more data to ensure we have enough for YoY calculation
    const thirteenMonthsAgoStr = thirteenMonthsAgo.toISOString().split('T')[0];

    const twoYearsAgo = new Date(today);
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const twoYearsAgoStr = twoYearsAgo.toISOString().split('T')[0];

    console.log('Date ranges:', {
      today: todayStr,
      thirteenMonthsAgo: thirteenMonthsAgoStr,
      twoYearsAgo: twoYearsAgoStr,
    });

    // Add individual error handling for each request
    try {
      const [
        cpiResponse,
        inflationResponse,
        unemploymentResponse,
        bondYieldResponse,
        gdpResponse,
        consumerConfidenceResponse,
      ] = await Promise.all([
        axios
          .get(
            `${BASE_URL}?series_id=CPIAUCNS&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${thirteenMonthsAgoStr}&frequency=m`
          )
          .catch(error => {
            console.error('Error fetching CPI data:', error.response?.data || error.message);
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=PCEPI&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${thirteenMonthsAgoStr}&frequency=m`
          )
          .catch(error => {
            console.error('Error fetching PCE data:', error.response?.data || error.message);
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=UNRATE&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=2020-01-01&frequency=m`
          )
          .catch(error => {
            console.error(
              'Error fetching unemployment data:',
              error.response?.data || error.message
            );
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=GS10&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=2015-01-01&frequency=m`
          )
          .catch(error => {
            console.error('Error fetching bond yield data:', error.response?.data || error.message);
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=A191RL1Q225SBEA&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=q`
          )
          .catch(error => {
            console.error('Error fetching GDP data:', error.response?.data || error.message);
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=UMCSENT&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=m`
          )
          .catch(error => {
            console.error(
              'Error fetching consumer confidence data:',
              error.response?.data || error.message
            );
            throw error;
          }),
      ]);

      console.log('Data points received:', {
        cpi: cpiResponse.data?.observations?.length,
        pce: inflationResponse.data?.observations?.length,
      });

      // Process CPI data
      const cpiData = calculateYoYChange(cpiResponse.data?.observations || []);
      console.log('CPI data points after YoY calculation:', cpiData.length);

      // Process PCE data
      const inflationData = calculateYoYChange(inflationResponse.data?.observations || []);
      console.log('PCE data points after YoY calculation:', inflationData.length);

      // Process other indicators
      const bondYieldData = (bondYieldResponse.data?.observations || [])
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const unemploymentData = (unemploymentResponse.data?.observations || [])
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const gdpData = (gdpResponse.data?.observations || [])
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const consumerConfidenceData = (consumerConfidenceResponse.data?.observations || [])
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const macroIndicators = {
        cpiData,
        inflationData,
        unemploymentData: unemploymentData || [],
        bondYieldData: bondYieldData || [],
        gdpData: gdpData || [],
        consumerConfidenceData: consumerConfidenceData || [],
      };

      return NextResponse.json(macroIndicators);
    } catch (apiError: any) {
      console.error('Error in API requests:', apiError);
      if (axios.isAxiosError(apiError) && apiError.response) {
        const fredError = apiError.response.data?.error_message || apiError.response.data;
        throw new Error(fredError || apiError.message);
      }
      throw apiError;
    }
  } catch (error: any) {
    console.error('Error fetching macro indicators:', error);

    // Handle any error and return appropriate response
    return NextResponse.json(
      {
        error: 'Failed to fetch macro indicators',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
