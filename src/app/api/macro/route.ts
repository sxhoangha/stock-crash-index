import { NextResponse } from 'next/server';
import axios from 'axios';

const FRED_API_KEY = process.env.FRED_API_KEY || 'demo';
const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// Cache for Shiller PE value (prevents excessive scraping)
// Note: In Vercel serverless functions, this cache persists within the same execution context
// but may be reset between cold starts. This is acceptable since CAPE values update infrequently.
let cachedShillerPE: { value: number | null; timestamp: number } = {
  value: null,
  timestamp: 0,
};

// Function to fetch current Shiller PE value for crash index calculation
async function fetchCurrentShillerPE(): Promise<number | null> {
  // Check cache first (24 hour TTL)
  const now = Date.now();
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (cachedShillerPE.value !== null && now - cachedShillerPE.timestamp < CACHE_TTL) {
    const ageHours = ((now - cachedShillerPE.timestamp) / (60 * 60 * 1000)).toFixed(1);
    console.log(`✓ Using cached Shiller PE: ${cachedShillerPE.value} (age: ${ageHours}h)`);
    return cachedShillerPE.value;
  }

  console.log('Cache miss or expired, fetching fresh Shiller PE value...');

  // Try Source 1: multpl.com scraping (most up-to-date public source)
  try {
    console.log('Fetching current Shiller PE from multpl.com...');
    const response = await axios.get('https://www.multpl.com/shiller-pe', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      timeout: 8000,
    });

    const html = response.data;

    // Look for numerical values that could be the CAPE ratio (typically 20-50 range)
    const potentialMatches = html.match(/\b([23]\d\.\d{1,2}|[4]\d\.\d{1,2}|50\.\d{1,2})\b/g);

    // Try multiple regex patterns to extract the current value in context
    const patterns = [
      /Current Shiller PE Ratio:\s*([\d.]+)/i,
      /Shiller PE Ratio:\s*([\d.]+)/i,
      /<div[^>]*id=["']current["'][^>]*>([\d.]+)<\/div>/i,
      /<div[^>]*class=["'][^"']*current[^"']*["'][^>]*>([\d.]+)<\/div>/i,
      />(\d+\.\d+)<\/(?:strong|span|div)/i,
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(html);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (!isNaN(value) && value > 5 && value < 100) {
          console.log(`✓ Current Shiller PE: ${value} (from multpl.com)`);
          // Cache the value
          cachedShillerPE = { value, timestamp: Date.now() };
          return value;
        }
      }
    }

    // Fallback: Use the first potential CAPE value found (usually the current value)
    if (potentialMatches && potentialMatches.length > 0) {
      const value = parseFloat(potentialMatches[0]);
      if (!isNaN(value) && value > 5 && value < 100) {
        console.log(`✓ Current Shiller PE: ${value} (from multpl.com)`);
        // Cache the value
        cachedShillerPE = { value, timestamp: Date.now() };
        return value;
      }
    }
  } catch (error) {
    console.error('multpl.com failed:', error instanceof Error ? error.message : error);
  }

  // Try Source 2: Alpha Vantage API - get PE ratio for SPY (S&P 500 ETF)
  const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (alphaVantageKey) {
    try {
      console.log('Fetching PE ratio from Alpha Vantage (SPY)...');
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=SPY&apikey=${alphaVantageKey}`,
        {
          timeout: 15000,
        }
      );

      console.log('Alpha Vantage response status:', response.status);
      console.log('Alpha Vantage data keys:', Object.keys(response.data || {}));

      if (response.data && response.data.PERatio) {
        const value = parseFloat(response.data.PERatio);
        if (!isNaN(value) && value > 0) {
          console.log(`✓ Current PE Ratio: ${value} (from Alpha Vantage - SPY)`);
          console.log('Note: Using forward PE ratio as proxy for Shiller CAPE');
          // Cache the value
          cachedShillerPE = { value, timestamp: Date.now() };
          return value;
        }
      } else {
        console.log(
          'Alpha Vantage response data:',
          JSON.stringify(response.data).substring(0, 200)
        );
      }
    } catch (error) {
      console.error('Alpha Vantage failed:', error instanceof Error ? error.message : error);
    }
  }

  // Try Source 3: Financial Modeling Prep API
  try {
    console.log('Trying Financial Modeling Prep API...');
    const response = await axios.get(
      'https://financialmodelingprep.com/api/v3/ratios/SPY?limit=1&apikey=demo',
      {
        timeout: 8000,
      }
    );

    if (response.data && Array.isArray(response.data) && response.data[0]) {
      const peRatio = response.data[0].priceEarningsRatio;
      if (peRatio && !isNaN(parseFloat(peRatio))) {
        const value = parseFloat(peRatio);
        console.log(`✓ Current PE Ratio: ${value} (from Financial Modeling Prep)`);
        // Cache the value
        cachedShillerPE = { value, timestamp: Date.now() };
        return value;
      }
    }
  } catch (error) {
    console.error(
      'Financial Modeling Prep failed:',
      error instanceof Error ? error.message : error
    );
  }

  console.error('❌ Could not fetch current Shiller PE value from any live source');
  console.error(
    '💡 Note: All free Shiller CAPE APIs have rate limits or require paid subscriptions'
  );
  console.error('💡 The crash index will calculate without this indicator');
  return null;
}

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
    }); // Add individual error handling for each request
    try {
      const [
        cpiResponse,
        inflationResponse,
        unemploymentResponse,
        bondYieldResponse,
        gdpResponse,
        consumerConfidenceResponse,
        totalDebtResponse,
        debtToGdpResponse,
        yieldCurveResponse,
        joblessClaimsResponse,
        shillerPEResponse,
        fedFundsRateResponse,
        creditSpreadResponse,
      ] = await Promise.allSettled([
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
        axios
          .get(
            `${BASE_URL}?series_id=GFDEBTN&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=q`
          )
          .catch(error => {
            console.error('Error fetching total debt data:', error.response?.data || error.message);
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=GFDEGDQ188S&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=q`
          )
          .catch(error => {
            console.error(
              'Error fetching debt-to-GDP data:',
              error.response?.data || error.message
            );
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=T10Y2Y&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=d`
          )
          .catch(error => {
            console.error(
              'Error fetching yield curve data:',
              error.response?.data || error.message
            );
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=ICSA&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=w`
          )
          .catch(error => {
            console.error(
              'Error fetching jobless claims data:',
              error.response?.data || error.message
            );
            throw error;
          }),
        // Fetch Shiller PE (CAPE) from multpl.com
        fetchCurrentShillerPE(),
        axios
          .get(
            `${BASE_URL}?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=m`
          )
          .catch(error => {
            console.error(
              'Error fetching Fed Funds Rate data:',
              error.response?.data || error.message
            );
            throw error;
          }),
        axios
          .get(
            `${BASE_URL}?series_id=BAMLH0A0HYM2&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_end=${todayStr}&observation_start=${twoYearsAgoStr}&frequency=d`
          )
          .catch(error => {
            console.error(
              'Error fetching credit spread data:',
              error.response?.data || error.message
            );
            throw error;
          }),
      ]);

      // Helper to safely get data from settled promises
      const getData = (result: any) => {
        if (result.status === 'fulfilled') {
          return result.value.data?.observations || [];
        }
        console.error('Promise rejected:', result.reason);
        return [];
      };

      console.log('Data points received:', {
        cpi: getData(cpiResponse).length,
        pce: getData(inflationResponse).length,
      });

      // Process CPI data
      const cpiData = calculateYoYChange(getData(cpiResponse));
      console.log('CPI data points after YoY calculation:', cpiData.length);

      // Process PCE data
      const inflationData = calculateYoYChange(getData(inflationResponse));
      console.log('PCE data points after YoY calculation:', inflationData.length);

      // Process other indicators
      const bondYieldData = getData(bondYieldResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const unemploymentData = getData(unemploymentResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const gdpData = getData(gdpResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();
      const consumerConfidenceData = getData(consumerConfidenceResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const totalDebtData = getData(totalDebtResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const debtToGdpData = getData(debtToGdpResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const yieldCurveData = getData(yieldCurveResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const joblessClaimsData = getData(joblessClaimsResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      // Get current Shiller PE value
      const currentShillerPE =
        shillerPEResponse.status === 'fulfilled' ? shillerPEResponse.value : null;

      const fedFundsRateData = getData(fedFundsRateResponse)
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }))
        .reverse();

      const creditSpreadData = getData(creditSpreadResponse)
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
        totalDebtData: totalDebtData || [],
        debtToGdpData: debtToGdpData || [],
        yieldCurveData: yieldCurveData || [],
        joblessClaimsData: joblessClaimsData || [],
        currentShillerPE: currentShillerPE,
        fedFundsRateData: fedFundsRateData || [],
        creditSpreadData: creditSpreadData || [],
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
