# Stock Market Crash Index Dashboard

A real-time dashboard that visualizes market health and calculates a "Crash Probability Score" based on various market and economic indicators.

## Features

- Real-time S&P 500 and VIX tracking
- Crash Probability Score (1-10)
- Macro indicators (CPI, Unemployment, Bond Yields)
- Sector performance tracking
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 7.x or later

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your API keys:
   ```env
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   FRED_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Material UI
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: Zustand
- **Data Fetching**: Axios
- **API Sources**:
  - Alpha Vantage (Market Data)
  - FRED (Economic Indicators)

## Crash Score Calculation

The Crash Probability Score (1-10) is calculated based on multiple factors:

- VIX levels
  - VIX > 30: +3 points
  - VIX > 20: +2 points
- S&P 500 performance
  - -5% over 7 days: +2 points
  - -10% over 30 days: +2 points
- Economic indicators
  - High CPI (>4%): +1 point
  - High Unemployment (>6%): +1 point
  - High Bond Yields (>5%): +1 point

Risk levels are categorized as:
- 1-3: Low Risk
- 4-6: Moderate Risk
- 7-10: High Risk

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
