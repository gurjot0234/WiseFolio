export const styles: Record<string, React.CSSProperties> = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0f172a', // Deep slate/navy premium background
      padding: '14px 28px',
      borderBottom: '1px solid #1e293b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    appName: {
      color: '#f8fafc',
      fontSize: '1.15rem',
      fontWeight: '600',
      margin: 0,
      letterSpacing: '-0.025em'
    },
    badge: {
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      fontSize: '0.7rem',
      fontWeight: '500',
      padding: '3px 8px',
      borderRadius: '4px',
      border: '1px solid #334155',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.825rem'
    },
    metaLabel: {
      color: '#64748b'
    },
    metaValueReady: {
      color: '#10b981', // Crisp compliance/ready green
      fontWeight: '500'
    },
    divider: {
      width: '1px',
      height: '20px',
      backgroundColor: '#334155'
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    avatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      letterSpacing: '0.05em'
    },
    userName: {
      color: '#cbd5e1',
      fontSize: '0.85rem',
      fontWeight: '500'
    }
  };