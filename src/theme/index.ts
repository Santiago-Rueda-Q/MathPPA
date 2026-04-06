export const theme = {
  colors: {
    primary: '#0F6E56', 
    secondary: '#185FA5', 
    accent: '#BA7517', 
    background: '#121212', 
    surface: '#1E1E1E', 
    glass: 'rgba(255, 255, 255, 0.08)',
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
      muted: '#666666',
    },
    border: '#2C2C2C',
    success: '#0F6E56',
    error: '#FF5252',
    warning: '#BA7517',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
    mono: 'FiraCode-Regular',
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
  },
};

export type Theme = typeof theme;
