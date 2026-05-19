import React from 'react';
import { runPortfolioPipeline } from '../portfolioEngine/orchestrator';
import Header from '../components/Header';
import RecommendationTable from '../components/RecommendationTable';
import {PipelineData } from "../types/types";

async function getPortfolioPipelineData(): Promise<PipelineData> {
  const urls = [
    'https://antarctica-hiring-data.s3.eu-west-1.amazonaws.com/portfolio-optimisation/2026-04/holdings.json',
    'https://antarctica-hiring-data.s3.eu-west-1.amazonaws.com/portfolio-optimisation/2026-04/prices.json',
    'https://antarctica-hiring-data.s3.eu-west-1.amazonaws.com/portfolio-optimisation/2026-04/benchmark.json',
    'https://antarctica-hiring-data.s3.eu-west-1.amazonaws.com/portfolio-optimisation/2026-04/constraints.json'
  ];

  
  // 1. Cleaner parallel fetch orchestration
  const responses = await Promise.all(
    urls.map(url => fetch(url, { 
      next: { revalidate: 3600 } // Opted for 1-hour ISR instead of no-store
    }))
  );

  // 2. Exact error pinpointing
  responses.forEach((res, index) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch asset from: ${urls[index]} (Status: ${res.status})`);
    }
  });

  // 3. Parallel JSON parsing
  const [rawHoldings, rawPrices, rawBenchmark, constraints] = await Promise.all(
    responses.map(res => res.json())
  );

  return { rawHoldings, rawPrices, rawBenchmark, constraints };
}

export default async function Dashboard() {
  try {
    const props = await getPortfolioPipelineData();
    
    const data = runPortfolioPipeline(
      props.rawHoldings,
      props.rawPrices,
      props.rawBenchmark,
      props.constraints
    );

    // 4. Fallback if pipeline returns empty/malformed results
    if (!data?.recommendedWeights) {
      throw new Error("Pipeline executed successfully but returned empty recommendations.");
    }

    return (
      <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex flex-col m-0 p-0 overflow-x-hidden">
        <Header />
        <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
          <RecommendationTable recommendation={data.recommendedWeights} />
        </main>
      </div>
    );
  } catch (err) {
    console.error('Dashboard pipeline failure:', err);
    
    return (
      <div className="min-h-screen w-full bg-[#0b0f19] text-red-400 flex flex-col items-center justify-center p-6">
        <Header />
        <div className="text-center max-w-md">
          <p className="mt-8 text-lg font-semibold">Error assembling portfolio optimization framework.</p>
          <p className="text-sm opacity-70 mt-2">
            {err instanceof Error ? err.message : 'Unknown system crash.'}
          </p>
        </div>
      </div>
    );
  }
}