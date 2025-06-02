import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type ThemeContextType = {
  theme: 'light' | 'dark';
  colors: typeof Colors.light | typeof Colors.dark;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const [theme, setTheme] = useState<'light' | 'dark'>(colorScheme || 'dark');

  useEffect(() => {
    // Set initial theme based on system preference, defaulting to dark
    if (colorScheme) {
      setTheme(colorScheme);
    } else {
      setTheme('dark');
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? Colors.light : Colors.dark;

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};