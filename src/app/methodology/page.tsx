'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function MethodologyPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: 4,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        {/* Back button */}
        <Box sx={{ mb: 3 }}>
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: 2 }}
            >
              Back to Dashboard
            </Button>
          </Link>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Crash Index Methodology
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Understanding how we predict market crashes using economic indicators
          </Typography>
        </Box>

        {/* Overview Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              What is the Crash Index?
            </Typography>
            <Typography variant="body1" paragraph>
              The Crash Index is a comprehensive risk scoring system that combines multiple economic
              and market indicators to assess the probability of a market crash. The score ranges from
              0 to 100, with higher scores indicating greater crash risk.
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>Risk Levels</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label="0-20: Low Risk" sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }} />
                <Chip label="21-40: Moderate Risk" sx={{ backgroundColor: '#8bc34a', color: 'white', fontWeight: 'bold' }} />
                <Chip label="41-60: Elevated Risk" sx={{ backgroundColor: '#ff9800', color: 'white', fontWeight: 'bold' }} />
                <Chip label="61-80: High Risk" sx={{ backgroundColor: '#ff5722', color: 'white', fontWeight: 'bold' }} />
                <Chip label="81-100: Extreme Risk" sx={{ backgroundColor: '#f44336', color: 'white', fontWeight: 'bold' }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Three-Tier Weighting System */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Three-Tier Weighting System
            </Typography>
            <Typography variant="body1" paragraph>
              Not all economic indicators are created equal. Our system categorizes indicators into three
              tiers based on their predictive power and timing relative to market crashes.
            </Typography>

            {/* Tier 1: Leading Indicators */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Tier 1: Leading Indicators (40 points)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Leading indicators predict crashes 6-18 months in advance. They receive the highest weight
                because they provide early warning signals.
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Indicator</strong></TableCell>
                      <TableCell align="right"><strong>Max Points</strong></TableCell>
                      <TableCell><strong>Why It Matters</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Yield Curve (10Y-2Y)</TableCell>
                      <TableCell align="right">15</TableCell>
                      <TableCell>Most reliable recession predictor. Inversions have preceded every recession since 1955.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Credit Spreads</TableCell>
                      <TableCell align="right">15</TableCell>
                      <TableCell>Signals credit market stress and investor fear. Widens before major downturns.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Shiller P/E Ratio</TableCell>
                      <TableCell align="right">10</TableCell>
                      <TableCell>Measures market valuation. Extreme highs preceded 1929, 2000, and 2008 crashes.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Tier 2: Concurrent Indicators */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningAmberIcon sx={{ color: '#ff9800' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                  Tier 2: Concurrent Indicators (35 points)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Concurrent indicators move in real-time with market conditions. They confirm that risk is
                materializing in the present.
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Indicator</strong></TableCell>
                      <TableCell align="right"><strong>Max Points</strong></TableCell>
                      <TableCell><strong>Why It Matters</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>VIX (Fear Index)</TableCell>
                      <TableCell align="right">12</TableCell>
                      <TableCell>Real-time measure of market fear. Spikes during crashes and corrections.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fed Funds Rate</TableCell>
                      <TableCell align="right">10</TableCell>
                      <TableCell>Monetary policy stance. Aggressive tightening can trigger recessions.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jobless Claims</TableCell>
                      <TableCell align="right">8</TableCell>
                      <TableCell>Weekly labor market health. Rapid increases signal deteriorating economy.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CPI (Inflation)</TableCell>
                      <TableCell align="right">5</TableCell>
                      <TableCell>High inflation forces Fed to tighten policy, potentially triggering recession.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Tier 3: Lagging Indicators */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ErrorOutlineIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                  Tier 3: Lagging Indicators (25 points)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Lagging indicators confirm that a crash is underway or has already occurred. They receive
                lower weight because they provide little advance warning.
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Indicator</strong></TableCell>
                      <TableCell align="right"><strong>Max Points</strong></TableCell>
                      <TableCell><strong>Why It Matters</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>S&P 500 Decline</TableCell>
                      <TableCell align="right">10</TableCell>
                      <TableCell>Confirms crash is happening. -10% = correction, -20% = bear market.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Unemployment Rate</TableCell>
                      <TableCell align="right">8</TableCell>
                      <TableCell>Confirms recession. Typically rises after economic damage is done.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GDP Growth</TableCell>
                      <TableCell align="right">4</TableCell>
                      <TableCell>Quarterly measure. Negative growth confirms recession (reported with delay).</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consumer Confidence</TableCell>
                      <TableCell align="right">3</TableCell>
                      <TableCell>Reflects sentiment. Drops after bad news is already known.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Individual Indicator Deep Dives */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Indicator Deep Dives
        </Typography>

        {/* Yield Curve */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Yield Curve (10Y-2Y Treasury Spread)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The difference between the 10-year and 2-year U.S. Treasury yields. A normal yield curve is
              positive (long-term rates higher than short-term). An inverted curve (negative spread) occurs
              when short-term rates exceed long-term rates.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              The yield curve has predicted every U.S. recession since 1955 with no false signals. Inversion
              typically occurs 6-18 months before a recession begins. It reflects bond market expectations
              that the Fed will need to cut rates in the future due to economic weakness.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              When investors expect a recession, they buy long-term bonds (driving yields down) and avoid
              short-term bonds (keeping yields high), causing inversion. This also restricts bank lending
              profitability, tightening credit conditions.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &gt; 0.5% (normal positive curve)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 0% to 0.5% (flattening)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &lt; 0% (inverted)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2006-2007:</strong> Inverted in July 2006, 16 months before the 2008 financial crisis</Typography></li>
              <li><Typography variant="body2"><strong>2000:</strong> Inverted in February 2000, preceded dot-com crash</Typography></li>
              <li><Typography variant="body2"><strong>1989:</strong> Inverted before 1990-1991 recession</Typography></li>
              <li><Typography variant="body2"><strong>2019:</strong> Brief inversion in August 2019, followed by COVID-19 recession in 2020</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Credit Spreads */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">High Yield Credit Spreads</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The difference between yields on high-yield (junk) corporate bonds and U.S. Treasury bonds,
              measured in basis points (bps). Higher spreads indicate investors demand more compensation
              for taking credit risk.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              Credit spreads are a real-time barometer of financial market stress. Widening spreads signal
              that investors fear corporate defaults, credit market freezes, and economic deterioration.
              Extreme widening has preceded every major financial crisis.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              When economic outlook deteriorates, investors sell risky corporate bonds and buy safe Treasuries
              (flight to quality). This drives up corporate yields and lowers Treasury yields, widening the spread.
              Wide spreads also make it expensive for companies to borrow, slowing business investment.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 400 bps (normal risk premium)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 400-600 bps (credit stress emerging)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 600 bps (credit crisis)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2008 Financial Crisis:</strong> Spreads exploded to 2,000+ bps in December 2008</Typography></li>
              <li><Typography variant="body2"><strong>2020 COVID Crash:</strong> Spreads spiked to 1,100 bps in March 2020</Typography></li>
              <li><Typography variant="body2"><strong>2001-2002:</strong> Widened to 1,000 bps during dot-com bust and Enron/WorldCom scandals</Typography></li>
              <li><Typography variant="body2"><strong>1998 LTCM Crisis:</strong> Spread widening signaled systemic risk in hedge fund collapse</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Shiller P/E */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Shiller P/E Ratio (CAPE)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The Cyclically Adjusted Price-to-Earnings ratio (CAPE), developed by Nobel laureate Robert Shiller.
              It divides the S&P 500 price by the average of 10 years of inflation-adjusted earnings. Historical
              average is around 16-17.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              The Shiller P/E smooths out short-term earnings volatility to reveal whether the market is
              fundamentally overvalued or undervalued. Extreme valuations (CAPE &gt; 30) have preceded major
              crashes because stocks become too expensive relative to long-term earning power.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              High CAPE ratios indicate investor euphoria and future returns are likely to be poor. When
              valuations are extreme, stocks are vulnerable to repricing downward when growth disappoints or
              interest rates rise. Mean reversion is a powerful force over long time horizons.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 25 (below historical average to average)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 25-30 (elevated valuations)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 30 (bubble territory)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>1929 Peak:</strong> CAPE reached 32.6 before the Great Depression crash (-89% decline)</Typography></li>
              <li><Typography variant="body2"><strong>2000 Dot-Com Bubble:</strong> CAPE peaked at 44.2, highest in history. S&P 500 fell -49% over next 2.5 years</Typography></li>
              <li><Typography variant="body2"><strong>2007 Pre-Crisis:</strong> CAPE at 27.5 before -57% crash in 2008-2009</Typography></li>
              <li><Typography variant="body2"><strong>2021:</strong> CAPE reached 38+, signaling extreme valuations before 2022 bear market</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* VIX */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">VIX (Volatility Index)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The CBOE Volatility Index, calculated from S&P 500 options prices. It represents the market's
              expectation of 30-day volatility. Often called the "Fear Index."
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              VIX spikes during market panic and crashes as investors rush to buy protective put options.
              Readings above 30 indicate extreme fear, while readings above 40 signal panic selling. It's a
              real-time measure of market stress.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              VIX is calculated from the prices of S&P 500 index options. When investors expect big market
              swings, they bid up option prices, causing VIX to rise. VIX tends to spike sharply during
              crashes then decay back to normal levels (10-15) during calm periods.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 20 (normal market conditions)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 20-30 (elevated uncertainty)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 30 (extreme fear/panic)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2008 Financial Crisis:</strong> VIX hit 80.86 in November 2008, all-time high</Typography></li>
              <li><Typography variant="body2"><strong>2020 COVID Crash:</strong> VIX spiked to 82.69 in March 2020</Typography></li>
              <li><Typography variant="body2"><strong>1987 Black Monday:</strong> VIX not yet created, but implied volatility exceeded 100</Typography></li>
              <li><Typography variant="body2"><strong>2011 Debt Ceiling Crisis:</strong> VIX jumped to 48 during U.S. credit downgrade</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Fed Funds Rate */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Federal Funds Rate</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The interest rate at which banks lend to each other overnight, set by the Federal Reserve.
              It's the Fed's primary tool for controlling monetary policy and influencing economic growth.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              The Fed Funds rate affects all other interest rates in the economy. When the Fed raises rates
              aggressively to fight inflation, it can "break" something in the financial system or tip the
              economy into recession. High rates increase borrowing costs, reduce spending, and can trigger
              asset price declines.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              The Fed raises rates to slow inflation by making borrowing more expensive, which reduces spending
              and investment. However, aggressive tightening can overshoot and cause recession. The Fed must
              balance inflation control against economic growth.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 4% (accommodative to neutral policy)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 4-5% (tight monetary policy)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 5% (restrictive policy, recession risk)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2007-2008:</strong> Fed raised rates to 5.25% by mid-2006, helping trigger housing crash and financial crisis</Typography></li>
              <li><Typography variant="body2"><strong>2000-2001:</strong> Fed raised rates to 6.5% in 2000, contributing to dot-com bubble bursting</Typography></li>
              <li><Typography variant="body2"><strong>1980-1982:</strong> Volcker Fed raised rates above 19% to crush inflation, causing severe recession</Typography></li>
              <li><Typography variant="body2"><strong>2022-2023:</strong> Fed raised from 0% to 5.5% in fastest tightening cycle since 1980s</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Jobless Claims */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Initial Jobless Claims</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The number of people filing for unemployment benefits for the first time each week. Released
              every Thursday by the Department of Labor, it's the most timely indicator of labor market health.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              Jobless claims are a real-time early warning system for labor market deterioration. A sustained
              rise in claims indicates companies are laying off workers, which signals economic weakness and
              can spiral into recession as laid-off workers cut spending.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              During economic expansion, claims typically run 200,000-250,000 per week. When the economy
              weakens, companies reduce headcount and claims spike. Sustained readings above 300,000 indicate
              labor market stress. Claims are a leading indicator because layoffs happen before unemployment
              rate rises.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 250,000 (strong labor market)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 250,000-350,000 (labor market softening)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 350,000 (labor market stress, recession likely)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2008 Financial Crisis:</strong> Claims surged from 300K to 665K (peak in March 2009)</Typography></li>
              <li><Typography variant="body2"><strong>2020 COVID:</strong> Claims exploded to historic 6.9 million in one week (March 2020)</Typography></li>
              <li><Typography variant="body2"><strong>2001 Recession:</strong> Claims rose from 300K to 500K as dot-com bubble burst</Typography></li>
              <li><Typography variant="body2"><strong>1990-1991 Recession:</strong> Claims jumped from 350K to 500K+</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* CPI */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">CPI (Consumer Price Index)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The Consumer Price Index measures the average change in prices paid by consumers for goods and
              services. It's reported monthly as a year-over-year percentage change, representing the inflation rate.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              High inflation forces the Federal Reserve to raise interest rates aggressively, which can trigger
              recessions. Runaway inflation also erodes purchasing power, reduces consumer spending, and creates
              economic uncertainty. The Fed's inflation-fighting measures have caused most post-WWII recessions.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              The Bureau of Labor Statistics tracks prices of a basket of ~80,000 goods and services. When
              inflation runs above the Fed's 2% target, the central bank raises interest rates to slow demand
              and bring prices down. However, aggressive rate hikes risk causing recession.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 3% (at or near Fed target)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 3-4% (elevated, Fed may tighten)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 4% (high inflation, aggressive Fed action likely)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>1970s Stagflation:</strong> CPI reached 14% in 1980, forcing Fed to raise rates above 19%, causing deep recession</Typography></li>
              <li><Typography variant="body2"><strong>2008 Oil Spike:</strong> CPI hit 5.6% in July 2008 (due to $147 oil), worsening financial crisis</Typography></li>
              <li><Typography variant="body2"><strong>2021-2022:</strong> CPI surged to 9.1% in June 2022, forcing fastest Fed tightening since 1980s</Typography></li>
              <li><Typography variant="body2"><strong>1990-1991:</strong> CPI around 6% contributed to Fed keeping rates high, triggering recession</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* S&P 500 Decline */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">S&P 500 Decline (7-day & 30-day)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The percentage change in the S&P 500 index over the past 7 days and 30 days. A -10% decline
              from recent highs is considered a "correction," while -20% is a "bear market."
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              Large stock declines confirm that a crash is underway. While this is a lagging indicator (the
              damage is already happening), rapid declines can trigger panic selling, margin calls, and
              wealth destruction that spreads to the real economy.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              The S&P 500 represents 500 of the largest U.S. companies and ~80% of total U.S. stock market
              value. Declines reflect deteriorating corporate earnings expectations, rising risk premiums,
              and investor pessimism about economic growth.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &gt; -5% (normal volatility)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> -5% to -10% (pullback)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &lt; -10% (correction or bear market)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>1929 Crash:</strong> S&P fell -89% from peak to trough (1929-1932)</Typography></li>
              <li><Typography variant="body2"><strong>1987 Black Monday:</strong> S&P crashed -20% in a single day (October 19, 1987)</Typography></li>
              <li><Typography variant="body2"><strong>2000-2002:</strong> S&P fell -49% during dot-com bust</Typography></li>
              <li><Typography variant="body2"><strong>2008 Financial Crisis:</strong> S&P declined -57% from peak (October 2007 to March 2009)</Typography></li>
              <li><Typography variant="body2"><strong>2020 COVID:</strong> S&P fell -34% in just 33 days (fastest bear market ever)</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Unemployment */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Unemployment Rate</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The percentage of the labor force that is jobless and actively seeking employment. Released
              monthly by the Bureau of Labor Statistics as part of the jobs report.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              Unemployment is a lagging indicator that confirms recession. When people lose jobs, they cut
              spending, which reduces business revenue, leading to more layoffs in a downward spiral. High
              unemployment also reduces tax revenue and increases government spending on safety nets.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              The unemployment rate is calculated from a monthly survey of ~60,000 households. It tends to
              rise after recessions have already begun because companies exhaust other cost-cutting measures
              before layoffs. The rate typically peaks 6-12 months after a recession ends.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &lt; 5% (full employment)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 5-6% (labor market softening)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &gt; 6% (recession likely or underway)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2008-2009:</strong> Unemployment rose from 5% to 10% (peaked October 2009)</Typography></li>
              <li><Typography variant="body2"><strong>2020 COVID:</strong> Unemployment spiked from 3.5% to 14.7% in two months</Typography></li>
              <li><Typography variant="body2"><strong>1982 Recession:</strong> Unemployment hit 10.8%, highest since Great Depression</Typography></li>
              <li><Typography variant="body2"><strong>2001 Recession:</strong> Unemployment rose from 4% to 6.3%</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* GDP Growth */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">GDP Growth Rate</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              The quarterly percentage change in Gross Domestic Product, adjusted for inflation. GDP measures
              the total value of all goods and services produced in the economy. Reported as an annualized rate.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              GDP is the broadest measure of economic health. Two consecutive quarters of negative growth is
              the traditional definition of recession. However, GDP is very lagged (reported with 1-month delay
              and revised twice), so by the time it turns negative, the recession is already underway.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              GDP = Consumption + Investment + Government Spending + Net Exports. The Bureau of Economic
              Analysis compiles data from thousands of sources. Strong growth (&gt;3%) indicates healthy economy,
              weak growth (&lt;1%) signals trouble, and negative growth confirms recession.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &gt; 1.5% (solid expansion)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 0% to 1.5% (sluggish growth)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &lt; 0% (recession)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2008 Q4:</strong> GDP fell -8.4% annualized, worst quarter since 1958</Typography></li>
              <li><Typography variant="body2"><strong>2020 Q2:</strong> GDP plunged -31.4% annualized during COVID lockdowns</Typography></li>
              <li><Typography variant="body2"><strong>1982 Recession:</strong> GDP contracted -6.4% in Q1 1982</Typography></li>
              <li><Typography variant="body2"><strong>2001 Recession:</strong> GDP fell for three quarters (Q1, Q3 2001)</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Consumer Confidence */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Consumer Confidence Index</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              What it is:
            </Typography>
            <Typography variant="body2" paragraph>
              A monthly survey by the Conference Board measuring consumer attitudes about current economic
              conditions and future expectations. The index is benchmarked to 100 (1985 baseline). Typical
              range is 50-120.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Why it matters:
            </Typography>
            <Typography variant="body2" paragraph>
              Consumer spending represents ~70% of U.S. GDP. When consumers are pessimistic, they cut spending
              and increase saving, which slows economic growth. However, confidence is a lagging indicator
              because it typically drops after bad news is already known (job losses, stock declines).
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              How it works:
            </Typography>
            <Typography variant="body2" paragraph>
              The Conference Board surveys ~3,000 households about current business/employment conditions and
              6-month outlook. Responses are indexed and combined into a composite score. Confidence tends to
              track stock market performance and unemployment trends.
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threshold Logic:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li><Typography variant="body2"><strong>Healthy:</strong> &gt; 100 (optimistic consumers)</Typography></li>
              <li><Typography variant="body2"><strong>Caution:</strong> 85-100 (weakening sentiment)</Typography></li>
              <li><Typography variant="body2"><strong>Warning:</strong> &lt; 85 (pessimistic, recession risk)</Typography></li>
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Historical Examples:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li><Typography variant="body2"><strong>2008 Financial Crisis:</strong> Confidence plunged to 25.3 in February 2009 (all-time low)</Typography></li>
              <li><Typography variant="body2"><strong>2020 COVID:</strong> Dropped to 85.7 in April 2020 as economy shut down</Typography></li>
              <li><Typography variant="body2"><strong>2001 Recession:</strong> Fell to 84.9 after 9/11 attacks and dot-com crash</Typography></li>
              <li><Typography variant="body2"><strong>1990-1991:</strong> Declined to 52.9 during Gulf War and recession</Typography></li>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 4 }} />

        {/* Footer */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Disclaimer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The Crash Index is an educational tool and should not be used as the sole basis for investment
            decisions. Past performance of indicators does not guarantee future results. Markets are complex
            and unpredictable. Always consult with a qualified financial advisor before making investment decisions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
