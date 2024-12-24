import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeContextType, ThemeSettings, Logo } from '@/types/theme';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { defaultTheme } from '@/config/default-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<{
    theme: ThemeSettings;
    logo?: Logo;
  }>({
    theme: defaultTheme,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteSettings', 'theme'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as { theme: ThemeSettings; logo?: Logo });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (settings.theme) {
      // Aplicar variáveis CSS
      const root = document.documentElement;

      // Cores
      Object.entries(settings.theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      // Tipografia
      Object.entries(settings.theme.typography).forEach(([key, value]) => {
        root.style.setProperty(`--typography-${key}`, value);
      });

      // Espaçamento
      Object.entries(settings.theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });

      // Border Radius
      Object.entries(settings.theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });

      // Shadows
      Object.entries(settings.theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }
  }, [settings.theme]);

  const updateTheme = async (theme: ThemeSettings) => {
    try {
      await setDoc(
        doc(db, 'siteSettings', 'theme'),
        {
          theme,
          ...(settings.logo && { logo: settings.logo }),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  };

  const updateLogo = async (logo: Logo) => {
    try {
      await setDoc(
        doc(db, 'siteSettings', 'theme'),
        {
          logo,
          theme: settings.theme,
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating logo:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateTheme,
        updateLogo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
