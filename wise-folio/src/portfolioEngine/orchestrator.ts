import { RawHolding, RawPrice, RawBenchmark, Constraints, ChartDataPoint } from '../types/types';
import { cleanHoldingsData } from './dataCleaner'; // Implemented in previous step
import { pivotPrices, getMonthlyReturns, calculateAssetMetrics } from './metrics';
import { selectOptimalAssets, computeHeuristicWeights } from './optimizer';

export function runPortfolioPipeline(
  rawHoldings: RawHolding[],
  rawPrices:  RawPrice[],
  rawBenchmark: RawBenchmark[],
  constraints: Constraints
) {
  // 1. Data Sanitization & Ingestion
  const cleanHoldings = cleanHoldingsData(rawHoldings);
  const { matrix: priceMatrix, dates } = pivotPrices(rawPrices);

  // 2. Compute Performance Metrics
  const monthlyReturns = getMonthlyReturns(priceMatrix, dates);
  const assetMetrics = calculateAssetMetrics(monthlyReturns, cleanHoldings);

  // 3. Selection and Bounded Weight Allocations
  const selectedIsins = selectOptimalAssets(assetMetrics, constraints);
  const recommendedWeights = computeHeuristicWeights(selectedIsins, assetMetrics, constraints);

  // Flatten raw current weights map for performance engine comparability
  const currentWeights: Record<string, number> = {};
  Object.values(cleanHoldings).forEach(h => currentWeights[h.isin] = h.weight);

  return {
    recommendedWeights, 
    assetMetrics      
  };
}
