import { ThemeSettings } from '@/types/theme';

export const defaultTheme: ThemeSettings = {
  colors: {
    primary: '#012458',    // Azul principal
    secondary: '#F10006',  // Vermelho principal
    background: '#ffffff',
    text: '#1a1a1a',
    border: '#e5e7eb',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFontFamily: 'Inter, system-ui, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.5',
  },
  spacing: {
    base: '1rem',
    small: '0.5rem',
    medium: '1.5rem',
    large: '2rem',
  },
  borderRadius: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem',
  },
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
