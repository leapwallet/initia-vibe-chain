import { createContext, useEffect, useMemo, useState } from 'react';

/**
 * Available theme options.
 */
type Theme = 'dark' | 'light' | 'system';

/**
 * Props for the ThemeProvider component.
 */
type ThemeProviderProps = {
  /** Child components to wrap with theme context */
  children: React.ReactNode;
  /** Default theme to use if none is stored */
  defaultTheme?: Theme;
  /** Key to use for localStorage persistence */
  storageKey?: string;
};

/**
 * Theme provider state interface.
 */
type ThemeProviderState = {
  /** Current theme setting */
  theme: Theme;
  /** Resolved theme (actual light/dark value) */
  resolvedTheme: 'light' | 'dark';
  /** Function to update the theme */
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return theme;
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    root.style.setProperty('color-scheme', resolvedTheme);
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
