export const styles: Record<string, React.CSSProperties> = {
    chartBox: {
      backgroundColor: '#111827',
      borderRadius: '0.75rem',
      border: '1px solid #1f293d',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      padding: '1.5rem',
      width: '100%',
      boxSizing: 'border-box'
    },
    headerRow: {
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem'
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#ffffff',
      letterSpacing: '-0.025em',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: 0
    },
    titleIndicator: {
      width: '0.375rem',
      height: '1rem',
      backgroundColor: '#00d09c',
      borderRadius: '9999px',
      display: 'inline-block'
    },
    subtitle: {
      fontSize: '0.75rem',
      color: '#64748b',
      marginTop: '0.125rem',
      fontWeight: 500,
      marginBottom: 0
    },
    legendGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '12px',
      fontWeight: 500
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem'
    },
    legendCurrentMarker: {
      width: '0.625rem',
      height: '0.625rem',
      borderRadius: '2px',
      backgroundColor: '#3b82f6'
    },
    legendTargetMarker: {
      width: '0.625rem',
      height: '0.625rem',
      borderRadius: '2px',
      backgroundColor: '#00d09c'
    },
    legendLabel: {
      color: '#94a3b8'
    },
    graphFrame: {
      width: '100%',
      height: '320px',
      fontFamily: 'monospace',
      fontSize: '11px'
    }
  };