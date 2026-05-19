import { RawHolding,CleanHolding } from '../types/types';

  export function cleanHoldingsData(rawHoldings: RawHolding[]): Record<string, CleanHolding> {
    const assetClassMapping: Record<string, string> = {
      'equity': 'Equity',
      'fixed-income': 'Fixed Income',
      'fi': 'Fixed Income',
      'fixed income': 'Fixed Income',
      'alternatives': 'Alternatives'
    };
  
    const currencyMapping: Record<string, string> = {
      'US$': 'USD',
      '$': 'USD'
    };
  
    // Initialize the dictionary map container
    const cleanHoldings: Record<string, CleanHolding> = {};
  
    for (const raw of rawHoldings) {
      const cleanIsin = raw.isin.trim();
      const cleanName = raw.name.trim();
      
      // Normalize Asset Class
      const assetClassKey = raw.asset_class.trim().toLowerCase();
      const normalizedAssetClass = assetClassMapping[assetClassKey] || raw.asset_class.trim();
  
      // Normalize Currency
      const currencyKey = raw.currency.trim();
      const normalizedCurrency = currencyMapping[currencyKey] || currencyKey;
  
      // Check if the ISIN already exists as a key in our Record map
      if (cleanHoldings[cleanIsin]) {
        // Safely combine weights to avoid float rounding bugs (e.g., 0.1 + 0.2 = 0.30000000000000004)
        const mergedWeight = cleanHoldings[cleanIsin].weight + Number(raw.weight);
        cleanHoldings[cleanIsin].weight = Number(mergedWeight.toFixed(4));
      } else {
        // Initialize key-value pair under the clean ISIN
        cleanHoldings[cleanIsin] = {
          isin: cleanIsin,
          name: cleanName,
          assetClass: normalizedAssetClass,
          currency: normalizedCurrency,
          weight: Number(Number(raw.weight).toFixed(4))
        };
      }
    }
  
    return cleanHoldings;
  }