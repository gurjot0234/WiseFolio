import React from 'react';
import { styles } from './styles';
interface HeaderProps {
  appName?: string;
  environment?: 'Production' | 'Staging' | 'UAT';
}

export const Header: React.FC<HeaderProps> = ({ 
  appName = "Wise Folio", 
  environment = "Production" 
}) => {
  return (
    <header style={styles.header}>
      {/* Left Section: Logo & Application Name */}
      <div style={styles.leftSection}>
        <div style={styles.logoContainer}>
          {/* Professional Geometric/Trend SVG Logo */}
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#2563eb"/>
            <path 
              d="M8 22L13.5 15.5L17.5 19.5L24 11" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle cx="24" cy="11" r="2" fill="#10b981"/>
          </svg>
        </div>
        
        <div style={styles.titleContainer}>
          <h1 style={styles.appName}>{appName}</h1>
          <span style={styles.badge}>{environment}</span>
        </div>
      </div>

      {/* Right Section: System Metrics & Mock User Session */}
      <div style={styles.rightSection}>
        <div style={styles.metaItem}>
          <span style={styles.metaLabel}>Data Status:</span>
          <span style={styles.metaValueReady}>● Live</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.userProfile}>
          <div style={styles.avatar}>PM</div>
          <span style={styles.userName}>Portfolio Manager</span>
        </div>
      </div>
    </header>
  );
};
