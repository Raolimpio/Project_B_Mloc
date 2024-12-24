import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from './contexts/theme-context';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);