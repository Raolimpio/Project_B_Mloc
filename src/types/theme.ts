export interface Logo {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
  typography: {
    fontFamily: string;
    headingFontFamily: string;
    baseFontSize: string;
    lineHeight: string;
  };
  spacing: {
    base: string;
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface SiteSettings {
  id: string;
  theme: ThemeSettings;
  logo: Logo;
  favicon: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface ThemeContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  updateTheme: (newTheme: Partial<ThemeSettings>) => Promise<void>;
  updateLogo: (logoData: Logo) => Promise<void>;
  updateFavicon: (faviconUrl: string) => Promise<void>;
}
