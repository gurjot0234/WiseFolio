export type AssetClass = "Equity" | "Fixed Income" | "Alternatives" | string;

export interface RawHolding {
  isin: string;
  name: string;
  asset_class: string;
  currency: string;
  weight: number | string;
}

export interface CleanHolding {
  isin: string;
  name: string;
  assetClass: string;
  currency: string;
  weight: number;
}

export interface RawPrice {
  date: string | number;
  isin: string;
  price: string | number;
}

export interface RawBenchmark {
  date: string;
  level: number | string;
}

export interface Constraints {
  min_weight: number;
  max_weight: number;
  per_asset_class_caps: Record<AssetClass, number>;
  max_assets: number;
}

export interface AssetMetrics {
  isin: string;
  name: string;
  assetClass: AssetClass;
  currentReturn: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export interface ChartDataPoint {
  date: string;
  currentPortfolio: number;
  recommendedPortfolio: number;
  benchmark: number;
}

export interface PriceMatrix {
  [date: string]: { [isin: string]: number };
}
