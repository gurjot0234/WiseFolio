import { RawPrice, PriceMatrix, AssetMetrics, CleanHolding } from '../types/types';

// Helper to pivot raw tall prices to wide matrix format
export function pivotPrices(rawPrices: RawPrice[]): { matrix: PriceMatrix; dates: string[] } {
  const matrix: PriceMatrix = {};
  const dateSet = new Set<string>();

  rawPrices.forEach((row) => {
    const price = typeof row.price === 'string' ? parseFloat(row.price) : row.price;
    if (isNaN(price)) return;

    if (!matrix[row.date]) matrix[row.date] = {};
    matrix[row.date][row.isin] = price;
    dateSet.add(row.date.toString());
  });

  const dates = Array.from(dateSet).sort();
  return { matrix, dates };
}

// Function 1: Get Monthly Returns from Daily Price Matrix
export function getMonthlyReturns(matrix: PriceMatrix, dates: string[]): Record<string, Record<string, number>> {
  const monthlyReturns: Record<string, Record<string, number>> = {};
  const monthEndPrices: Record<string, Record<string, number>> = {};

  // Group by YYYY-MM and find the last chronological entry (month-end price)
  dates.forEach((date) => {
    const monthKey = date.substring(0, 7); // "2023-04"
    if (!monthEndPrices[monthKey]) monthEndPrices[monthKey] = {};
    
    // Overwriting continuously ensures the final iteration captures the last trading day of the month
    Object.assign(monthEndPrices[monthKey], matrix[date]);
  });

  const sortedMonths = Object.keys(monthEndPrices).sort();

  // Calculate monthly percentage change
  for (let m = 1; m < sortedMonths.length; m++) {
    const currentMonth = sortedMonths[m];
    const prevMonth = sortedMonths[m - 1];
    monthlyReturns[currentMonth] = {};

    Object.keys(monthEndPrices[currentMonth]).forEach((isin) => {
      const currentPrice = monthEndPrices[currentMonth][isin];
      const prevPrice = monthEndPrices[prevMonth][isin];

      if (prevPrice && prevPrice > 0) {
        monthlyReturns[currentMonth][isin] = (currentPrice - prevPrice) / prevPrice;
      }
    });
  }

  return monthlyReturns;
}

// Function 2: Calculate Expected Return, Volatility, and Sharpe Ratio
export function calculateAssetMetrics(
  monthlyReturns: Record<string, Record<string, number>>,
  cleanHoldings: Record<string, CleanHolding>
): AssetMetrics[] {
  const assetData: Record<string, number[]> = {};

  // Gather individual historical return arrays per asset
  Object.values(monthlyReturns).forEach((monthRow) => {
    Object.entries(monthRow).forEach(([isin, ret]) => {
      if (!assetData[isin]) assetData[isin] = [];
      assetData[isin].push(ret);
    });
  });

  const metrics: AssetMetrics[] = [];

  Object.entries(assetData).forEach(([isin, returns]) => {
    const holding = cleanHoldings[isin];
    if (!holding || returns.length < 2) return; // Need variance data points

    // Mean Return calculation
    const sum = returns.reduce((acc, val) => acc + val, 0);
    const mean = sum / returns.length;

    // Variance & Standard Deviation calculation
    const varianceSum = returns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const variance = varianceSum / (returns.length - 1); // Sample variance
    const volatility = Math.sqrt(variance);

    // Risk-adjusted metrics (Sharpe ratio)
    const sharpeRatio = volatility > 0 ? mean / volatility : 0;

    metrics.push({
      isin,
      name: holding.name,
      assetClass: holding.assetClass,
      currentReturn:holding.weight,
      expectedReturn: mean,
      volatility,
      sharpeRatio,
    });
  });

  return metrics;
}