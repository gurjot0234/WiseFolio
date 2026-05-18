import { AssetMetrics, Constraints, AssetClass, RecommendationResult} from '../types/types';

export function selectOptimalAssets(metrics: AssetMetrics[], constraints: Constraints): string[] {
  // Group assets by class
  const grouped: Record<AssetClass, AssetMetrics[]> = {
    Equity: [],
    'Fixed Income': [],
    Alternatives: [],
  };

  metrics.forEach((m) => {
    if (grouped[m.assetClass]) grouped[m.assetClass].push(m);
  });

  // Sort each category descending by Sharpe Ratio
  Object.keys(grouped).forEach((key) => {
    grouped[key as AssetClass].sort((a, b) => b.sharpeRatio - a.sharpeRatio);
  });

  // Balance extraction rule: Top 2 Equities, Top 2 Fixed Income, Top 1 Alternative = 5 assets
  const selected: string[] = [];
  
//   if (grouped['Equity'][0]) selected.push(grouped['Equity'][0].isin);
//   if (grouped['Equity'][1]) selected.push(grouped['Equity'][1].isin);

//   if (grouped['Fixed Income'][0]) selected.push(grouped['Fixed Income'][0].isin);
//   if (grouped['Fixed Income'][1]) selected.push(grouped['Fixed Income'][1].isin);
  
//   if (grouped['Alternatives'][0]) selected.push(grouped['Alternatives'][0].isin);

  // Fallback safety layer: if an asset class is completely empty, fill to hit max_assets limit
  if (selected.length < constraints.max_assets) {
    const flatSorted = [...metrics].sort((a, b) => b.sharpeRatio - a.sharpeRatio);
    for (const asset of flatSorted) {
      if (selected.length >= constraints.max_assets) break;
      if (!selected.includes(asset.isin)) selected.push(asset.isin);
    }
  }

  return selected.slice(0, constraints.max_assets);
}

// Function 4: Distribute capital with dynamic floor/ceiling redistribution loops
export function computeHeuristicWeights(
  selectedIsins: string[],
  metrics: AssetMetrics[],
  constraints: Constraints
): RecommendationResult[] {
  const weights: Record<string, number> = {};
  const minW = constraints.min_weight; // 0.02
  const maxW = constraints.max_weight; // 0.25

  // 1. Establish the statutory floors
  selectedIsins.forEach((isin) => (weights[isin] = minW));
  let unallocatedWeight = 1.0 - minW * selectedIsins.length;

  // Filter metrics to only our selected sub-universe
  const selectedMetrics = metrics.filter((m) => selectedIsins.includes(m.isin));
  
  // Shift negative Sharpe Ratios to zero to protect allocations
  const totalSharpe = selectedMetrics.reduce((sum, m) => sum + Math.max(0, m.sharpeRatio), 0);

  // 2. Proportional Distribution
  if (totalSharpe > 0) {
    selectedMetrics.forEach((m) => {
      const share = (Math.max(0, m.sharpeRatio) / totalSharpe) * unallocatedWeight;
      weights[m.isin] += share;
    });
  } else {
    // Equal distribution fallback if all historical metrics are negative
    selectedIsins.forEach((isin) => (weights[isin] += unallocatedWeight / selectedIsins.length));
  }

  // 3. Ceiling Optimization Iterations
  let checkRequired = true;
  let iterations = 0;
  
  while (checkRequired && iterations < 10) {
    checkRequired = false;
    let excessCapital = 0;
    let elasticAssetCount = 0;

    selectedIsins.forEach((isin) => {
      if (weights[isin] > maxW) {
        excessCapital += weights[isin] - maxW;
        weights[isin] = maxW;
        checkRequired = true;
      } else if (weights[isin] < maxW) {
        elasticAssetCount++;
      }
    });

    if (excessCapital > 0 && elasticAssetCount > 0) {
      selectedIsins.forEach((isin) => {
        if (weights[isin] < maxW) {
          weights[isin] += excessCapital / elasticAssetCount;
        }
      });
    }
    iterations++;
  }

  // 4. Transform optimization arrays into your final requested structured payload objects
  return selectedIsins.map((isin) => {
    const metricElement = metrics.find((m) => m.isin === isin);
    
    // Safely round the calculated final recommended weight to 4 decimals
    const finalRecommendedWeight = Math.round((weights[isin] ? weights[isin] : 0) * 10000) / 10000;

    // Gracefully handle dynamic variations in the underlying metrics interface definitions
    const extractedCurrentWeight = metricElement 
      ? (metricElement.currentReturn  ? metricElement.currentReturn : 0) 
      : 0;

    return {
      isin: isin,
      name: metricElement ? metricElement.name : '',
      recommendedWeight: finalRecommendedWeight,
      currentWeight: extractedCurrentWeight,
      assetClass: metricElement ? metricElement.assetClass : ''
    };
  });
}