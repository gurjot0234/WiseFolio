'use client'
import React, { useState } from 'react';
import { RecommendationChart } from '../RecommendationChart/RecommendationChart'; 
import { RecommendationResult } from '../../types/types';
import { styles } from './styles';
interface RecommendationTableProps {
  recommendation: RecommendationResult[];
}

export const RecommendationTable: React.FC<RecommendationTableProps> = ({ recommendation }) => {
  // Tracking mouse state manually to support native style hovers without class utilities
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.chartWrapper}>
          <RecommendationChart recommendation={recommendation} />
        </div>
        <div style={styles.ledgerSegment}>
          {/* Header Panel */}
          <div style={styles.headerPanel}>
            <div style={styles.titleWrapper}>
              <h3 style={styles.title}>
                <span style={styles.titleIndicator}></span>
                Portfolio Optimization Breakdown
              </h3>
              <p style={styles.subtitle}>
                Target metrics calculated by the rebalancing engine vs your current holdings
              </p>
            </div>     
            <div style={styles.badge}>
              {recommendation.length} Securit{recommendation.length === 1 ? 'y' : 'ies'} Tracked
            </div>
          </div>

          {/* Table Container */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ISIN</th>
                  <th style={styles.th}>Asset Name</th>
                  <th style={styles.th}>Asset Class</th>
                  <th style={{ ...styles.th, ...styles.thRight }}>Current Weight</th>
                  <th style ={{ ...styles.th, ...styles.thRight }}>Target Weight</th>
                  <th style={{ ...styles.th, ...styles.thRight }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {recommendation.map((asset) => {
                  const variance = asset.recommendedWeight - asset.currentWeight;
                  const isOverweighted = variance > 0;
                  const isNeutral = Math.abs(variance) < 0.00001;
                  const isCurrentRowHovered = hoveredRow === asset.isin;

                  // Dynamic contextual variations
                  const rowBackground = isCurrentRowHovered ? 'rgba(30, 41, 59, 0.4)' : 'transparent';
                  const isinColor = isCurrentRowHovered ? '#64748b' : '#475569';
                  const nameColor = isCurrentRowHovered ? '#00d09c' : '#ffffff';

                  // Dynamic Variance Badge styles
                  const variancePillStyle: React.CSSProperties = isNeutral
                    ? { color: '#64748b', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(51, 65, 85, 0.2)' }
                    : isOverweighted
                      ? { color: '#00e676', backgroundColor: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.2)' }
                      : { color: '#ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)' };

                  return (
                    <tr 
                      key={asset.isin} 
                      onMouseEnter={() => setHoveredRow(asset.isin)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ 
                        backgroundColor: rowBackground, 
                        transition: 'background-color 75ms ease' 
                      }}
                    >
                      <td style={{ ...styles.td, ...styles.tdIsin, color: isinColor }}>
                        {asset.isin}
                      </td>
                      
                      <td style={{ ...styles.td, ...styles.tdName, color: nameColor, transition: 'color 100ms ease' }}>
                        {asset.name}
                      </td>
                      
                      <td style={{ ...styles.td, ...styles.tdClass }}>
                        <span style={styles.classSpan}>
                          {asset.assetClass}
                        </span>
                      </td>
                      
                      <td style={{ ...styles.td, ...styles.tdWeightCurrent }}>
                        {formatPercentage(asset.currentWeight)}
                      </td>
                      
                      <td style={{ ...styles.td, ...styles.tdWeightTarget }}>
                        {formatPercentage(asset.recommendedWeight)}
                      </td>
                      
                      <td style={{ ...styles.td, ...styles.tdVariance }}>
                        <span style={{ ...styles.pill, ...variancePillStyle }}>
                          {isNeutral ? '' : isOverweighted ? '▲ +' : '▼ '}
                          {formatPercentage(variance)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};