import { createContext, useState, useMemo, useEffect } from 'react';

export const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

export const ThemeProvider = ({ children }) => {
  // Start with a default theme to prevent flash
  const [mode, setMode] = useState('light');

  // Load the theme from localStorage after component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    // Only set if the stored theme is 'light' or 'dark'
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setMode(storedTheme);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      {children}
    </ThemeContext.Provider>
  );
}; 