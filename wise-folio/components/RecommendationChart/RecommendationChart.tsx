'use client'
import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from 'recharts';
import { styles } from './styles';

export interface RecommendationEntry {
  isin: string;
  name: string;
  recommendedWeight: number;
  currentWeight: number;
  assetClass: string;
}

interface RecommendationChartProps {
  recommendation: RecommendationEntry[];
}

export const RecommendationChart: React.FC<RecommendationChartProps> = ({ recommendation }) => {
  // Tracking column hover states internally to preserve dynamic micro-animations
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Parse decimal percentage weights to raw numbers for graphing bounds (e.g. 0.1245 -> 12.45)
  const chartData = recommendation.map(asset => ({
    name: asset.name.length > 12 ? `${asset.name.substring(0, 10)}...` : asset.name,
    'Current %': parseFloat((asset.currentWeight * 100).toFixed(2)),
    'Target %': parseFloat((asset.recommendedWeight * 100).toFixed(2)),
  }));

  return (
    <div style={styles.chartBox}>
      
      {/* Chart Metadata Controls Row */}
      <div style={styles.headerRow}>
        <div style={styles.titleWrapper}>
          <h4 style={styles.title}>
            <span style={styles.titleIndicator}></span>
            Target Allocation Variance
          </h4>
          <p style={styles.subtitle}>
            Visual comparison between current asset distribution vs recommended optimizations
          </p>
        </div>
        
        {/* Customized Pure Inline Legend Badges */}
        <div style={styles.legendGroup}>
          <div style={styles.legendItem}>
            <span style={styles.legendCurrentMarker} />
            <span style={styles.legendLabel}>Current Allocation</span>
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendTargetMarker} />
            <span style={styles.legendLabel}>Target Allocation</span>
          </div>
        </div>
      </div>

      {/* Render Node for Recharts Mapping Canvas */}
      <div style={styles.graphFrame}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setHoveredBarIndex(Number(state.activeTooltipIndex));
              }
            }}
            onMouseLeave={() => setHoveredBarIndex(null)}
          >
            {/* Soft Midnight Grid Backdrops */}
            <CartesianGrid stroke="#1f293d" strokeDasharray="3 3" vertical={false} />
            
            {/* X-Axis Dimension Mapping Configuration */}
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              tickLine={false}
              dy={10} 
            />
            
            {/* Y-Axis Value Grid Bounds Configuration */}
            <YAxis 
              stroke="#64748b" 
              tickLine={false}
              tickFormatter={(val) => `${val}%`}
              dx={-5}
            />
            
            {/* Custom Interactive Dark Panel Floating Popups */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#141d2f',
                borderColor: '#1f293d',
                borderRadius: '6px',
                color: '#ffffff',
                fontFamily: 'sans-serif'
              }}
              itemStyle={{ color: '#cbd5e1' }}
              cursor={{ fill: 'rgba(30, 41, 59, 0.2)' }}
            />
            
            {/* Core Current Weight Blue Asset Array Data Stream */}
            <Bar dataKey="Current %" maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-current-${index}`} 
                  fill="#3b82f6"
                  style={{
                    opacity: hoveredBarIndex === null || hoveredBarIndex === index ? 1 : 0.4,
                    transition: 'opacity 150ms ease'
                  }}
                />
              ))}
            </Bar>
            
            {/* Target Weight Groww-Emerald Asset Array Data Stream */}
            <Bar dataKey="Target %" maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-target-${index}`} 
                  fill="#00d09c"
                  style={{
                    opacity: hoveredBarIndex === null || hoveredBarIndex === index ? 1 : 0.4,
                    transition: 'opacity 150ms ease'
                  }}
                />
              ))}
            </Bar>
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};