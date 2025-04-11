export const theme = {
  colors: {
    emergency: '#DC2626', // Emergency Red
    safe: '#10B981',     // Safe Green
    warning: '#FACC15',  // Warning Yellow
    light: '#F9FAFB',    // Light Gray
    dark: '#111827',     // Charcoal Black
    
    // Gradients and variations
    primaryGradient: 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',
    emergencyGradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    warningGradient: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
    darkGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
    
    // Transparency variants
    safeTrans: 'rgba(16, 185, 129, 0.1)',
    emergencyTrans: 'rgba(220, 38, 38, 0.1)',
    darkTrans: 'rgba(17, 24, 39, 0.8)',
    lightTrans: 'rgba(249, 250, 251, 0.95)',
    
    // UI elements
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textLight: '#F9FAFB',
    border: 'rgba(17, 24, 39, 0.1)',
    background: '#F3F4F6',
    surface: '#FFFFFF',
  },
  
  animations: {
    bounceTransition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    },
    fastFade: {
      duration: 0.2,
    },
    slowFade: {
      duration: 0.5,
    }
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    glow: '0 0 15px rgba(16, 185, 129, 0.5)',
    emergencyGlow: '0 0 15px rgba(220, 38, 38, 0.5)'
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    xxl: '1.5rem',
    full: '9999px'
  },
  
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem'
  }
};

export default theme;
