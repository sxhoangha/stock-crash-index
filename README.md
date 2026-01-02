# Stock Market Crash Index Dashboard

A real-time dashboard that visualizes market health and warns about potential economic downturns using a sophisticated multi-tier scoring system.

## 🌐 Live Demo

**[View Live Dashboard →](https://stock-crash-index.vercel.app/)**

## ✨ Features

- **Crash Index Score (0-100)** - Comprehensive risk assessment with three-tier breakdown
  - Leading Indicators (40 pts): Yield curve, credit spreads, Shiller P/E
  - Concurrent Indicators (35 pts): VIX, Fed Funds rate, jobless claims, CPI
  - Lagging Indicators (25 pts): S&P 500 performance, unemployment, GDP, consumer confidence
- **Real-time Market Data** - S&P 500 and VIX tracking
- **10 Key Economic Indicators** with health status (Healthy/Caution/Warning)
- **Interactive Charts** - Historical trends for all macro indicators
- **Risk Level Assessment** - Low, Moderate, Elevated, High, or Extreme

## 📊 Indicators Tracked

### Leading Indicators
- Yield Curve (10Y-2Y spread)
- Credit Spreads (High Yield)
- Shiller P/E Ratio (CAPE)

### Concurrent Indicators
- VIX (Volatility Index)
- Federal Funds Rate
- Initial Jobless Claims
- CPI (Inflation)

### Lagging Indicators
- S&P 500 Performance
- Unemployment Rate
- GDP Growth
- Consumer Confidence Index

## 🔌 API Sources

- **Yahoo Finance** - Market Data (S&P 500, VIX)
- **FRED (Federal Reserve)** - Economic Indicators
- **multpl.com** - Shiller P/E Ratio (CAPE)
- **Alpha Vantage** - Alternative market data (optional)


## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-crash-index.git
   cd stock-crash-index
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your API keys:
   ```env 
   FRED_API_KEY=your_fred_api_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here (optional)
   ```

   > **Get API Keys:**
   > - FRED API: [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)
   > - Alpha Vantage (optional): [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📈 Methodology

The Crash Index uses a weighted scoring system that prioritizes leading indicators (predictive signals) over concurrent and lagging indicators. The score ranges from 0-100:

- **0-20**: Low Risk
- **21-40**: Moderate Risk
- **41-60**: Elevated Risk
- **61-80**: High Risk
- **81-100**: Extreme Risk

See the [Methodology Page](https://stock-crash-index.vercel.app/methodology) for detailed scoring logic.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This dashboard is for educational and informational purposes only. It is not financial advice. Always consult with a qualified financial advisor before making investment decisions.



